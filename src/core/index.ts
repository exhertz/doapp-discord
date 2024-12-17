import {
    Client,
    GatewayIntentBits,
    Partials,
    Guild
} from 'discord.js';

import 'dotenv/config';

import logger from './modules/logger.js';

const startTime = Date.now();
const requiredEnvVariables = [
    'TOKEN'
];

const client = new Client({
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

Object.assign(client, logger);
client.config = process.env;

const missingEnvVariables = requiredEnvVariables.filter((varName) => !process.env[varName]);

if (missingEnvVariables.length > 0) {
    console.error(`Missing .env variables: ${missingEnvVariables.join(', ')}`);
    process.exit(1);
}

client.login(client.config.TOKEN);

client.on('ready', async () => {
    client.log('core', `Application started -> ${Date.now()-startTime} ms.`);
    let serverList = `Servers(${client.guilds.cache.size}):`;

    client.guilds.cache.forEach((guild: Guild) =>
        serverList = serverList.concat('\n\t\t', `ID: ${guild.id}  Name: ${guild.name}`));

    client.log('core', serverList);

    setInterval(() => {
        const newDate = new Date();
        const dateStr = newDate.toLocaleDateString().slice(0, -5);
        const timeStr = newDate.toLocaleTimeString();
        const l = `[~] ${dateStr} ${timeStr} | PING: ${Math.round(global.client.ws.ping)} ms`;
        client.log('core', l);
    }, 1000 * 60 * 60);
});

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

const startup = async () => {
    client.log('core', '');
    try {
        await import('@Plugins/index.js');
        client.log('core', ':: Plugins Loaded');
    } catch (err) {
        console.error(err);
        client.warn('core', 'Failed to load any plugins, a plugin has errors in it.');
    }
};

export { client };

startup();


