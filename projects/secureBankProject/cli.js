
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
        )
        .option(
            '--reporters <formats>',
            'Comma-separated report formats: html,allure,excel',
            'html'
        );

    command.action(async (options) => {
    const exitCode = await secureBankProject(options);

    if (exitCode !== 0) {
        process.exitCode = exitCode;
    }
});
}

export { registerSecureProject };
