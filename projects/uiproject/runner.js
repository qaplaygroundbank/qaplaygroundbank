const path = require('path');
const { spawn } = require('child_process');

async function runUiProject(options) {

    console.log('=================================');
    console.log('      UI PROJECT EXECUTION       ');
    console.log('=================================');

    console.log(`Environment : ${options.env}`);
    console.log(`Suite       : ${options.suite}`);

    const configFile = path.resolve(
        __dirname,
        'config/uiproject.config.js'
    );

    console.log(`Config File : ${configFile}`);

    console.log('');
    console.log('Starting Playwright...');
    console.log('');

    // Resolve the Playwright CLI installed in this project
    const playwrightCLI = require.resolve('@playwright/test/cli');

    // Launch Playwright through Node.js on any supported OS
    const playwrightProcess = spawn(
        process.execPath,
        [
            playwrightCLI,
            'test',
            '--config',
            configFile
        ],
        {
            stdio: 'inherit'
        }
    );

    return new Promise((resolve, reject) => {

        playwrightProcess.on('close', (exitCode) => {

            if (exitCode === 0) {
                console.log('');
                console.log('Playwright execution completed successfully.');
                resolve();
            } else {
                console.log('');
                console.log(
                    `Playwright execution failed. Exit code: ${exitCode}`
                );

                reject(
                    new Error(`Playwright failed with exit code ${exitCode}`)
                );
            }
        });

        playwrightProcess.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = {
    runUiProject
};
