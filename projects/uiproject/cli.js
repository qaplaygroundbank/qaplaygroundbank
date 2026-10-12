
import { runUiProject } from './runner.js';
import { addGlobalOptions } from '../../cli/options.js';

function registerUiProject(program) {
    const uiCommand = program
        .command('ui')
        .description('Run UI automation project');

    addGlobalOptions(uiCommand);

    uiCommand
        .option(
            '--test-file <file>',
            'Run a specific UI test file'
        );

    uiCommand.action(async (options) => {
        await runUiProject(options);
    });
}

export { registerUiProject };
