import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import logger from '../../commonlib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function anzProject(options) {
    const browser = options.browser || 'chromium';
    const suite = options.suite || 'smoke';
    const configFile = path.resolve(__dirname, 'config/anzProject.config.js');
    const args = [require.resolve('@playwright/test/cli'), 'test'];

    if (options.testFile) {
        const testFile = path.resolve(__dirname, options.testFile);
        const relativeTestFile = path.relative(
            path.resolve(__dirname, 'tests'),
            testFile
        );

        if (
            path.isAbsolute(relativeTestFile) ||
            relativeTestFile === '..' ||
            relativeTestFile.startsWith(`..${path.sep}`)
        ) {
            throw new Error(
                'The test file must be inside projects/anzProject/tests.'
            );
        }

        args.push(relativeTestFile.split(path.sep).join('/'));
        logger.info(`Test File   : ${testFile}`);
    }

    args.push('--config', configFile, '--project', browser);

    if (options.headed) {
        args.push('--headed');
    }

    const suiteNames = suite
        .split(',')
        .map((name) => name.trim().toLowerCase())
        .filter(Boolean);

    if (suiteNames.length === 0) {
        throw new Error('Please provide at least one suite name.');
    }

    if (!suiteNames.includes('regression')) {
        args.push(
            '--grep',
            `@(?:${suiteNames.map(escapeRegExp).join('|')})`
        );
    }

    logger.info('=================================');
    logger.info('    ANZ CRM DEMO TEST RUN        ');
    logger.info('=================================');
    logger.info(`Suite       : ${suite}`);
    logger.info(`Browser     : ${browser}`);
    logger.info(`Config File : ${configFile}`);

    const playwrightProcess = spawn(process.execPath, args, {
        stdio: 'inherit',
        env: {
            ...process.env,
            ANZ_TEST_HOLD_MS: options.hold
        }
    });

    return new Promise((resolve, reject) => {
        playwrightProcess.on('error', (error) => {
            logger.error('Failed to start Playwright:', error);
            reject(error);
        });

        playwrightProcess.on('close', (exitCode) => {
            if (exitCode === 0) {
                resolve();
                return;
            }
            reject(new Error(`Playwright failed with exit code ${exitCode}`));
        });
    });
}

export { anzProject };
