const { Command } = require('commander');
const { registerProjects } = require('./registerProjects');

function startCLI() {

    const program = new Command();

    program
        .name('qaplayground')
        .description('QA Automation Framework')
        .version('1.0.0');

    registerProjects(program);

    program.parse(process.argv);
}

module.exports = {
    startCLI
};
