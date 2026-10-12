const { runUiProject } = require('./runner');

function registerUiProject(program) {

    program
        .command('ui')
        .description('Run UI automation project')
        .option('--env <environment>', 'Environment to run against', 'qa')
        .option('--suite <suite>', 'Test suite to execute', 'smoke')
        .action(async (options) => {

            await runUiProject(options);

        });
}

module.exports = {
    registerUiProject
};
