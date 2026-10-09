const { runApiProject } = require('./runner');

function registerApiProject(program) {

    program
        .command('api')
        .description('Run API automation project')
        .option('--env <environment>', 'Environment to run against', 'qa')
        .option('--suite <suite>', 'Test suite to execute', 'smoke')
        .action(async (options) => {

            await runApiProject(options);

        });
}

module.exports = {
    registerApiProject
};
