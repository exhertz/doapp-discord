import {
    Client,
    REST,
    Routes
} from 'discord.js';

const registerCommands = async (client: Client) => {
    const commandsData: any[] = [];

    client.log('core', ':: Loading Commands');

    client.slashCommands.forEach((command) => {
        client.log('core', `::: SlashCommand: \x1b[92m${command.data.name}\x1b[0m loaded.`);
        commandsData.push(command.data.toJSON());
    });

    client.contextMenuCommands.forEach((command) => {
        client.log('core', `::: ContextMenuCommand: \x1b[92m${command.data.name}\x1b[0m loaded.`);
        commandsData.push(command.data.toJSON());
    });

    client.log('core', ':: Commands Loaded');

    const rest = new REST().setToken(client.config.TOKEN);

    try {
        client.log('core', `:: Started refreshing ${commandsData.length} application (/) commands.`);
        const data: any = await rest.put(
            Routes.applicationCommands(client.config.CLIENT_ID),
            { body: commandsData }
        );

        client.log('core', `:: Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error: any) {
        console.error(error);
    }
};

export { registerCommands };
