import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} from 'discord.js';
import logger from './modules/logger.js';
import { registerCommands } from './modules/registerCommands.js';
import { registerEvents } from './modules/registerEvents.js';

import 'dotenv/config';

const startTime = Date.now();

if (hasMissingEnvVariables([
    'TOKEN',
    'CLIENT_ID'
])) {
    exit(1);
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

const startup = async () => {
    client.log('core', ':: Loading Plugins');
    try {
        await import('@Plugins/index.js');
        client.log('core', ':: Plugins Loaded');
    } catch (err) {
        console.error(err);
        client.warn('core', 'Failed to load any plugins, a plugin has errors in it.');
    }
    try {
        client.log('core', ':: Loading Client');
        await client.login(client.config.TOKEN);
    } catch (err) {
        console.error(err);
        client.error('core', 'Failed to login client, exiting...');
        exit(1);
    }

    await registerCommands(client);
    await registerEvents(client);

    client.log('core', `Application started → ${Date.now()-startTime} ms.`);
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

    exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    client.error('core', 'Unhandled Rejection:\n' +
        'At:' + promise + '\nReason:' + reason);

    exit(1);
});

function exit(code: number) {
    process.exit(code);
};
