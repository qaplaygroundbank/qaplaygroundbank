import { registerApiProject } from '../projects/apiproject/cli.js';
import { registerMigrationProject } from '../projects/migrationproject/cli.js';
import { registerSecureProject } from '../projects/secureBankProject/cli.js';
import { registerParaBankProject } from '../projects/paraBankProject/cli.js';

function registerProjects(program) {
    registerApiProject(program);
    registerMigrationProject(program);
    registerSecureProject(program);
    registerParaBankProject(program);
}

export { registerProjects };
