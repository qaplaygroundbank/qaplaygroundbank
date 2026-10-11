const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '../../../.env')
});

const environments = {
    qa: {
        loginUrl:
            process.env.UI_QA_LOGIN_URL ||
            'https://qaplayground.com/bank/login',
        username: process.env.UI_QA_USERNAME,
        password: process.env.UI_QA_PASSWORD
    },
    dev: {
        loginUrl: process.env.UI_DEV_LOGIN_URL,
        username: process.env.UI_DEV_USERNAME,
        password: process.env.UI_DEV_PASSWORD
    },
    stage: {
        loginUrl: process.env.UI_STAGE_LOGIN_URL,
        username: process.env.UI_STAGE_USERNAME,
        password: process.env.UI_STAGE_PASSWORD
    }
};

function getUiConfig(environment) {
    const selectedConfig = environments[environment];

    if (!selectedConfig) {
        throw new Error(
            `Unsupported UI environment: ${environment}`
        );
    }

    if (!selectedConfig.loginUrl) {
        throw new Error(
            `Login URL is not configured for "${environment}". ` +
            `Please set UI_${environment.toUpperCase()}_LOGIN_URL.`
        );
    }

    return selectedConfig;
}

function getUiCredentials(environment) {
    const selectedConfig = getUiConfig(environment);

    if (!selectedConfig.username || !selectedConfig.password) {
        throw new Error(
            `Credentials are not configured for "${environment}". ` +
            `Please set UI_${environment.toUpperCase()}_USERNAME ` +
            `and UI_${environment.toUpperCase()}_PASSWORD.`
        );
    }

    return {
        username: selectedConfig.username,
        password: selectedConfig.password
    };
}

module.exports = {
    getUiConfig,
    getUiCredentials
};