
import { runMigrationProject } from './runner.js';
import { addGlobalOptions } from '../../cli/options.js';

function registerMigrationProject(program) {
    const migrationCommand = program
        .command('migration')
        .description('Run migration project');

    addGlobalOptions(migrationCommand);

    migrationCommand.action(async (options) => {
        await runMigrationProject(options);
    });
}

export { registerMigrationProject };
