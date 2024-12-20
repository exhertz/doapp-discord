import {
    Collection,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    UserContextMenuCommandInteraction
} from 'discord.js';

export interface Logger {
    log: (dir: string, text: string) => void;
    warn: (dir: string, text: string) => void;
    error: (dir: string, text: string) => void;
}

interface SlashCommand {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => void;
}

interface ContextMenuCommand {
    data: ContextMenuCommandBuilder;
    execute: (interaction: UserContextMenuCommandInteraction) => void;
}

declare module 'discord.js' {
    export interface Client extends Logger {
        config: global.NodeJS.ProcessEnv,
        slashCommands: Collection<string, SlashCommand>,
        contextMenuCommands: Collection<string, ContextMenuCommand>
    }
}
