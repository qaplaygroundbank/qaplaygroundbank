import config from '../globalconfigs/config.js';

function addGlobalOptions(command) {
    command
        .option(
            '--env <environment>',
            'Environment to run against',
            config.defaultEnvironment
        )
        .option(
            '--suite <suite>',
            'Test suite to execute',
            config.defaultSuite
        );

    return command;
}

export { addGlobalOptions };
