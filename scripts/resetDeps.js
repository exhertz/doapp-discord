/* eslint-disable callback-return */
import https from 'https';
import fs from 'fs';

function getBranch() {
    const args = process.argv.slice(2);
    const branchFlag = args.find(arg => arg.startsWith('--branch='));

    if (branchFlag) {
        return branchFlag.split('=')[1];
    } else {
        return 'main';
    }
}

const branch = getBranch();
const githubRepoUrl = `https://raw.githubusercontent.com/exhertz/doapp-discord/${branch}/package.json`;

const localPackagePath = './package.json';

function fetchPackageJsonFromRepo(url, callback) {
    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                callback(null, JSON.parse(data));
            } else {
                callback(new Error(`Error load file: ${response.statusCode}`));
            }
        });
    }).on('error', (err) => {
        callback(err);
    });
}

function updateDependencies() {
    fs.readFile(localPackagePath, 'utf8', (err, localData) => {
        if (err) {
            console.error('Read error local package.json:', err.message);
            return;
        }

        const localPackage = JSON.parse(localData);

        fetchPackageJsonFromRepo(githubRepoUrl, (err, repoPackage) => {
            if (err) {
                console.error('Download error:', err.message);
                return;
            }

            if (repoPackage.dependencies)
                localPackage.dependencies = repoPackage.dependencies;

            fs.writeFile(localPackagePath, JSON.stringify(localPackage, null, 2), (err) => {
                if (err) {
                    console.error('Write error:', err.message);
                } else {
                    console.log('resetDeps.js | Dependencies reset successfully!');
                    console.warn('resetDeps.js | Recommendation: Delete node_modules, and use npm install');
                }
            });
        });
    });
}

console.log(`resetDeps.js | Use branch: ${branch}`);
updateDependencies();
