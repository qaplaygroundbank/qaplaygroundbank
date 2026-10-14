import { Option } from 'commander';
import { runUiProject } from './runner.js';
import { addGlobalOptions } from '../../cli/options.js';

function registerUiProject(program) {
    const uiCommand = program
        .command('ui')
        .description('Run UI automation project');

    addGlobalOptions(uiCommand);

    uiCommand
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
            'Run a specific UI test file'
        );

    uiCommand.action(async (options) => {
        await runUiProject(options);
    });
}

export { registerUiProject };
