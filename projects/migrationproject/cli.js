const { runMigrationProject } = require('./runner');
const { addGlobalOptions } = require('../../cli/options');

function registerMigrationProject(program) {

    const migrationCommand = program
        .command('migration')
        .description('Run migration project');

    addGlobalOptions(migrationCommand);

    migrationCommand.action(async (options) => {
        await runMigrationProject(options);
    });
}

module.exports = {
    registerMigrationProject
};
