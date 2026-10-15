import { Option } from 'commander';
import { secureBankProject } from './runner.js';
import { addGlobalOptions } from '../../cli/options.js';

function registerSecureProject(program) {
    const command = program
        .command('securebank')
        .description('Run UI automation project');

    addGlobalOptions(command);

    command
        .addOption(
            new Option(
                '--browser <browser>',
                'Browser to use for UI tests'
            )
                .choices(['chromium', 'firefox', 'webkit'])
                .default('chromium')
        )
        .option(
            '--headed',
            'Run the browser in visible mode',
            false
        )
        .option(
            '--test-file <file>',
            'Run a specific secureBank UI test file'
        );

    command.action(async (options) => {
        await secureBankProject(options);
    });
}

export { registerSecureProject };
