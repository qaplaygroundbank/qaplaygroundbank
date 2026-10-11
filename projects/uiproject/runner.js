
const path = require('path');
const { spawn } = require('child_process');

async function runUiProject(options) {
    const browser = options.browser || 'chromium';
    const headed = options.headed || false;
    const suite = options.suite || 'smoke';

    console.log('=================================');
    console.log('      UI PROJECT EXECUTION       ');
    console.log('=================================');

    console.log(`Environment : ${options.env}`);
    console.log(`Suite       : ${suite}`);
    console.log(`Browser     : ${browser}`);
    console.log(`Headed      : ${headed}`);

    const configFile = path.resolve(
        __dirname,
        'config/uiproject.config.js'
    );

    const args = [
        require.resolve('@playwright/test/cli'),
        'test'
    ];

    // Add the test file before Playwright options.
    if (options.testFile) {
        const testFile = path.resolve(
            __dirname,
            options.testFile
        );

        args.push(testFile);
        console.log(`Test File   : ${testFile}`);
    } else {
        console.log('Test File   : All configured UI tests');
    }

    // Configure Playwright and browser selection.
    args.push(
        '--config',
        configFile,
        '--project',
        browser
    );

    // Enable headed mode only when requested.
    if (headed) {
        args.push('--headed');
    }

    // Split comma-separated suite names.
    const suiteNames = suite
        .split(',')
        .map((name) => name.trim().toLowerCase())
        .filter(Boolean);

    if (suiteNames.length === 0) {
        throw new Error(
            'Please provide at least one suite name.'
        );
    }

    // Regression means all tests, so do not apply a tag filter.
    if (!suiteNames.includes('regression')) {
        const escapedSuites = suiteNames.map((name) =>
            name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );

        const grepPattern = `@(?:${escapedSuites.join('|')})`;

        args.push('--grep', grepPattern);
    }

    console.log(`Config File : ${configFile}`);
    console.log('');
    console.log('Starting Playwright...');
    console.log('');

    const playwrightProcess = spawn(
        process.execPath,
        args,
        {
            stdio: 'inherit',
            env: {
                ...process.env,
                QA_PLAYGROUND_ENV: options.env
            }
        }
    );

    return new Promise((resolve, reject) => {
        playwrightProcess.on('error', reject);

        playwrightProcess.on('close', (exitCode) => {
            if (exitCode === 0) {
                console.log('');
                console.log(
                    'Playwright execution completed successfully.'
                );
                resolve();
            } else {
                console.log('');
                console.log(
                    `Playwright execution failed. Exit code: ${exitCode}`
                );

                reject(
                    new Error(
                        `Playwright failed with exit code ${exitCode}`
                    )
                );
            }
        });
    });
}

module.exports = {
    runUiProject
};
