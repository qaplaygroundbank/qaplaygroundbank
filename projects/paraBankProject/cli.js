import { Option } from 'commander';
import { paraBankProject } from './runner.js';
import { addGlobalOptions } from '../../cli/options.js';

function registerParaBankProject(program) {
    const paraBankCommand = program
        .command('parabank')
        .description('Run UI automation project');

    addGlobalOptions(paraBankCommand);

    paraBankCommand
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
            'Run a specific ParaBank UI test file'
        );

    paraBankCommand.action(async (options) => {
        await paraBankProject(options);
    });
}

export { registerParaBankProject };
