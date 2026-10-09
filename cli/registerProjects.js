const { registerApiProject } = require('../projects/apiproject/cli');
const { registerMigrationProject } = require('../projects/migrationproject/cli');
const { registerUiProject } = require('../projects/uiproject/cli');

function registerProjects(program) {

    registerApiProject(program);

    registerMigrationProject(program);

    registerUiProject(program);
}

module.exports = {
    registerProjects
};
