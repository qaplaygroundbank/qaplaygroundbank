
const { Option } = require('commander');
const config = require('../globalconfigs/config');

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
        )
        .addOption(
            new Option(
                '--browser <browser>',
                'Browser to use for UI tests'
            )
                .choices(['chromium', 'firefox', 'webkit'])
                .default('chromium')
        )
        .option(
            '--headed',
            'Run the browser in visible mode',
            false
        );

    return command;
}

module.exports = {
    addGlobalOptions
};
