import { Command } from 'commander';
import { registerProjects } from './registerProjects.js';

function startCLI() {
    const program = new Command();

    program
        .name('qaplayground')
        .description('QA Automation Framework')
        .version('1.0.0');

    registerProjects(program);

    program.parse(process.argv);
}

export { startCLI };
