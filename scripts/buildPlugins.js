import * as fs from 'fs';
import glob from 'fast-glob';

const pluginsImportsPath = './build/plugins/index.js';
fs.appendFileSync(pluginsImportsPath, '\r\n');

const options = { onlyDirectories: true };
const pluginFolders = await glob('./src/plugins/*', options);

function cleanupPath(path) {
    return path.replace('./src/plugins/', './').replace('.ts', '.js');
}

function getIndexPath(folder) {
    const checkIndexPath = folder + '/index.ts';
    const exists = fs.existsSync(checkIndexPath);
    return exists ? cleanupPath(checkIndexPath) : null;
}

for (const pluginFolder of pluginFolders) {
    if (fs.existsSync(pluginFolder + '/.disable') || pluginFolder.includes('!')) {
        continue;
    }

    const indexPath = getIndexPath(pluginFolder);
    if (indexPath !== null) {
        const importLine = `import '${indexPath}';`;
        fs.appendFileSync(pluginsImportsPath, importLine + '\r\n');
        fs.appendFileSync(pluginsImportsPath,
            `client.log('core', '::: Plugin: \x1b[96m${pluginFolder.replace('./src/plugins/', '')}\x1b[0m loaded.');`
            + '\r\n'
        );
    }
}
