
import { runApiProject } from './runner.js';
import { addGlobalOptions } from '../../cli/options.js';

function registerApiProject(program) {
    const apiCommand = program
        .command('api')
        .description('Run API automation project');

    addGlobalOptions(apiCommand);

    apiCommand.action(async (options) => {
        await runApiProject(options);
    });
}

export { registerApiProject };
