import { ContextMenuCommand, SlashCommand } from '@Core/types.js';
import { Client, Events, Guild, MessageFlags } from 'discord.js';

const registerEvents = async (client: Client) => {
    client.on(Events.ClientReady, async () => {
        client.log('core', ':: Client Logged');
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
};

export { registerEvents };
