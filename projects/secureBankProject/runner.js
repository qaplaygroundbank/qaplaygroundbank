import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import logger from '../../commonlib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

async function secureBankProject(options) {
    const browser = options.browser || 'chromium';
    const headed = options.headed || false;
    const suite = options.suite || 'smoke';

    logger.info('=================================');
    logger.info('      UI PROJECT EXECUTION       ');
    logger.info('=================================');

    logger.info(`Environment : ${options.env}`);
    logger.info(`Suite       : ${suite}`);
    logger.info(`Browser     : ${browser}`);
    logger.info(`Headed      : ${headed}`);

    const configFile = path.resolve(
        __dirname,
        'config/secureBankProject.config.js'
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
        logger.info(`Test File   : ${testFile}`);
    } else {
        logger.info('Test File   : All configured UI tests');
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

    logger.info(`Config File : ${configFile}`);
    logger.info('Starting Playwright...');

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
        playwrightProcess.on('error', (error) => {
            logger.error('Failed to start Playwright:', error);
            reject(error);
        });

        playwrightProcess.on('close', (exitCode) => {
            if (exitCode === 0) {
                logger.info(
                    'Playwright execution completed successfully.'
                );
                resolve();
            } else {
                logger.error(
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

export { secureBankProject };
