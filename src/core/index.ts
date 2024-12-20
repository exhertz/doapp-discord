import {
    Client,
    GatewayIntentBits,
    Partials,
    Guild,
    Collection,
    Events,
    MessageFlags
} from 'discord.js';
import logger from './modules/logger.js';

import 'dotenv/config';
import { registerCommands } from './modules/registerCommands.js';
import { ContextMenuCommand, SlashCommand } from './types.js';

const startTime = Date.now();

if (hasMissingEnvVariables([
    'TOKEN',
    'CLIENT_ID'
])) {
    process.exit(1);
}

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ]
});

client.slashCommands = new Collection();
client.contextMenuCommands = new Collection();
client.config = process.env;
Object.assign(client, logger);

client.on(Events.ClientReady, async () => {
    client.log('core', `Application started → ${Date.now()-startTime} ms.`);
    let serverList = `Servers(${client.guilds.cache.size}):`;

    client.guilds.cache.forEach((guild: Guild) =>
        serverList = serverList.concat('\n\t\t', `ID: ${guild.id}  Name: ${guild.name}`));

    client.log('core', serverList);

    setInterval(() => {
        client.log('core', `WebSocket ping: ${Math.round(client.ws.ping)} ms`);
    }, 1000 * 60 * 20);
});

client.on(Events.InteractionCreate, async (interaction) => {
    let command: SlashCommand | ContextMenuCommand | undefined;

    if (interaction.isChatInputCommand()) {
        command = client.slashCommands.get(interaction.commandName);
    } else if (interaction.isUserContextMenuCommand()) {
        command = client.contextMenuCommands.get(interaction.commandName);
    } else {
        return;
    }

    if (!command) {
        client.error('core', `No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        if (interaction.isChatInputCommand()) {
            await (command as SlashCommand).execute(interaction);
        } else if (interaction.isUserContextMenuCommand()) {
            await (command as ContextMenuCommand).execute(interaction);
        }
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral
            });
        }
    }
});

const startup = async () => {
    client.log('core', '');
    try {
        await import('@Plugins/index.js');
        client.log('core', ':: Plugins Loaded');
    } catch (err) {
        console.error(err);
        client.warn('core', 'Failed to load any plugins, a plugin has errors in it.');
    }

    await client.login(client.config.TOKEN);

    await registerCommands(client);
};

startup();

function hasMissingEnvVariables(variables: string[]): boolean {
    const missingEnvVariables = variables.filter((varName) => !process.env[varName]);

    if (missingEnvVariables.length > 0) {
        client.error('core', `Missing .env variables: ${missingEnvVariables.join(', ')}`);
        return true;
    }
    return false;
}

process.on('uncaughtException', (err, origin) => {
    client.error('core', 'Uncaught Exception:\n' +
        `Caught exception: ${err}\n` +
        `Origin: ${origin}`
    );

    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    client.error('core', 'Unhandled Rejection:\n' +
        'At:' + promise + '\nReason:' + reason);

    process.exit(1);
});
