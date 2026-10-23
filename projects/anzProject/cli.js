import { Option } from 'commander';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { anzProject } from './runner.js';
import { addGlobalOptions } from '../../cli/options.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: path.resolve(__dirname, '.env')
});

function registerAnzProject(program) {
    const anzCommand = program
        .command('anz')
        .description('Run ANZ Commercial CRM demo UI tests');

    addGlobalOptions(anzCommand);

    anzCommand
        .addOption(
            new Option('--browser <browser>', 'Browser to use for UI tests')
                .choices(['chromium', 'firefox', 'webkit'])
                .default('chromium')
        )
        .option('--headed', 'Run the browser in visible mode', false)
        .option(
            '--hold <milliseconds>',
            'Keep each test page open for this long after the test',
            process.env.ANZ_TEST_HOLD_MS || '5000'
        )
        .option('--test-file <file>', 'Run a specific ANZ project test file');

    anzCommand.action(async (options) => {
        await anzProject(options);
    });
}

export { registerAnzProject };
