const { runMigrationProject } = require('./runner');

function registerMigrationProject(program) {

    program
        .command('migration')
        .description('Run migration project')
        .option('--env <environment>', 'Environment to run against', 'qa')
        .option('--suite <suite>', 'Test suite to execute', 'smoke')
        .action(async (options) => {

            await runMigrationProject(options);

        });
}

module.exports = {
    registerMigrationProject
};
