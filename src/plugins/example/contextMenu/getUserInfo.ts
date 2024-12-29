import { ContextMenuCommand } from '@Core/types.js';
import { ContextMenuCommandBuilder } from 'discord.js';

export default <ContextMenuCommand> {
    data: new ContextMenuCommandBuilder()
        .setName('Get User Information')
        .setType(2), // ApplicationCommandType.User
    async execute(interaction) {
        const info = '**User info:** \n' +
                `├ Name: ${interaction.targetUser.displayName} \n` +
                `├ Tag: ${interaction.targetUser.tag} \n` +
                `├ Id: ${interaction.targetUser.id} \n` +
                `└ Avatar: ${interaction.targetUser.displayAvatarURL()}`;

        await interaction.reply({ content: info, ephemeral: true });
    }
};
