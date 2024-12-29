import { client } from '@Core/index.js';
import { ChannelType, Events } from 'discord.js';

import pingCommand from './slash/ping.js';
import getUserInfoContextMenuCommand from './contextMenu/getUserInfo.js';

client.slashCommands.set(pingCommand.data.name, pingCommand);
client.contextMenuCommands.set(getUserInfoContextMenuCommand.data.name, getUserInfoContextMenuCommand);

client.log('123', '123123');

/*
    This code is for demonstration, do not collect user message!
    It's disgusting.
*/
client.on(Events.MessageCreate, (message) => {
    if (message.channel.type !== ChannelType.GuildText) return;

    client.log('example-plugin',
        `${message.guild} | ${message.channel.name} | ${message.author.displayName}: ${message.content}`
    );
});
