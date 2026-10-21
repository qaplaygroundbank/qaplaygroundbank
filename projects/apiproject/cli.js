
import { runApiProject } from './runner.js';
import { addGlobalOptions } from '../../cli/options.js';

function registerApiProject(program) {
    const apiCommand = program
        .command('api')
        .description('Run API automation project');

    addGlobalOptions(apiCommand);

    apiCommand
        .option(
            '--reporters <formats>',
            'Comma-separated report formats: html,allure,excel',
            'html'
        );

    apiCommand.action(async (options) => {
        const exitCode = await runApiProject(options);

        if (exitCode !== 0) {
            process.exitCode = exitCode;
        }
    });
}

export { registerApiProject };
