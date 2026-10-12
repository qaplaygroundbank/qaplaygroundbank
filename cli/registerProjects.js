import { registerApiProject } from '../projects/apiproject/cli.js';
import { registerMigrationProject } from '../projects/migrationproject/cli.js';
import { registerUiProject } from '../projects/uiproject/cli.js';

function registerProjects(program) {
    registerApiProject(program);
    registerMigrationProject(program);
    registerUiProject(program);
}

export { registerProjects };
