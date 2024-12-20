import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { Logger } from '../types.js';

const padTo2Digits = (num: any) => num.toString().padStart(2, '0');
const formatDate = (date: any) => ([
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds())
].join(':'));

const dirname = path.dirname(fileURLToPath(import.meta.url));

function removeAnsiEscapeSequences(str: string) {
    // eslint-disable-next-line no-control-regex
    const ansiRegex = /\x1b\[[0-9;]*[mGKHmsu]/g;
    return str.replace(ansiRegex, '');
}

const writeLog = (level: 'log' | 'warn' | 'error', dir: string, text: string): void => {
    const currentDate = new Date();
    const datetime = formatDate(currentDate);
    const [nameFile] = currentDate.toISOString().split('T');
    
    const logsDir = path.join(dirname, '../../../logs/');
    const logFilePath = path.join(logsDir, dir);

    if (!fs.existsSync(logFilePath))
        fs.mkdirSync(logFilePath, { recursive: true });
    
    fs.appendFileSync(`${logFilePath}/${nameFile}.txt`, `[${datetime}] ${removeAnsiEscapeSequences(text)}\n`);

    if (level === 'log')
        console.log(`[${datetime}][${dir}] ${text}`);

    if (level === 'warn')
        console.warn(`[${datetime}][Warning][${dir}] ${text}`);

    if (level === 'error')
        console.error(`[${datetime}][Error][${dir}] ${text}`);
};

const logger: Logger = {
    log: (dir: string, text: string): void => {
        writeLog('log', dir, text);
    },
    warn: (dir: string, text: string): void => {
        writeLog('warn', dir, text);
    },
    error: (dir: string, text: string): void => {
        writeLog('error', dir, text);
    }
};

export default logger;
