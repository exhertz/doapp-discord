import fs from 'fs';
import path from 'node:path';
// import { Table } from 'console-table-printer';
import { fileURLToPath } from 'url';

// const p = new Table({
//     columns: [
//         { name: 'ChatCommands', alignment: 'center' },
//         { name: 's', alignment: 'center' }
//     ],
//     colorMap: {
//         customGreen: '\x1b[32m'
//     }
// });

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default async () => {
    const pluginsPath = path.resolve(dirname, '../../plugins');
    if (!fs.existsSync(pluginsPath)) {
        console.error(`${pluginsPath} not found!`);
        return;
    }

    const pluginsDir = fs.readdirSync(pluginsPath);

    if (!pluginsDir.length) {
        console.log('No plugins loaded!');
        return;
    };
    
    pluginsDir.forEach((plugin) => {
        console.log(plugin);
        if (plugin.startsWith('!')) {
            console.log(`Disable: ${plugin}`);
        } else {
            console.log(plugin);
            import (path.join(pluginsPath, plugin, '.js'));
        }
    });
};
