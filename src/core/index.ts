import {
    Client,
    GatewayIntentBits,
    Partials,
    Guild
} from 'discord.js';
import logger from './modules/logger.js';

import 'dotenv/config';

const startTime = Date.now();

if (hasMissingEnvVariables([
    'TOKEN'
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

client.config = process.env;
Object.assign(client, logger);

client.on('ready', async () => {
    client.log('core', `Application started -> ${Date.now()-startTime} ms.`);
    let serverList = `Servers(${client.guilds.cache.size}):`;

    client.guilds.cache.forEach((guild: Guild) =>
        serverList = serverList.concat('\n\t\t', `ID: ${guild.id}  Name: ${guild.name}`));

    client.log('core', serverList);

    setInterval(() => {
        client.log('core', `WebSocket ping: ${Math.round(client.ws.ping)} ms`);
    }, 1000 * 60 * 20);
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

    client.login(client.config.TOKEN);
};

startup();

function hasMissingEnvVariables(variables: string[]): boolean {
    const missingEnvVariables = variables.filter((varName) => !process.env[varName]);

    if (missingEnvVariables.length > 0) {
        console.error(`Missing .env variables: ${missingEnvVariables.join(', ')}`);
        return true;
    }
    return false;
}

process.on('uncaughtException', (err, origin) => {
    console.error('Uncaught Exception:\n' +
        `Caught exception: ${err}\n` +
        `Origin: ${origin}`
    );
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:\n' +
        'At:', promise, '\nReason:', reason);
});
