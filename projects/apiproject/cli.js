const { runApiProject } = require('./runner');
const { addGlobalOptions } = require('../../cli/options');

function registerApiProject(program) {

    const apiCommand = program
        .command('api')
        .description('Run API automation project');

    addGlobalOptions(apiCommand);

    apiCommand.action(async (options) => {
        await runApiProject(options);
    });
}

module.exports = {
    registerApiProject
};
