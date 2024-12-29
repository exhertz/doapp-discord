import { SlashCommand } from '@Core/types.js';
import { SlashCommandBuilder } from 'discord.js';

export default <SlashCommand> {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('123123');
    }
};
