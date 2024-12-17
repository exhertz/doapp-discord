export interface Logger {
    log: (dir: string, text: string) => void;
    warn: (dir: string, text: string) => void;
}

declare module 'discord.js' {
    export interface Client extends Logger {
        config: global.NodeJS.ProcessEnv
    }
}
