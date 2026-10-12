import appConfig from '../config/app.config.js';

const environment =
    process.env.QA_PLAYGROUND_ENV || 'qa';

const uiConfig = appConfig.getUiConfig(environment);

export const URLS = {
    LOGIN_PAGE: uiConfig.loginUrl
};

export const VALIDATIONS = {
    DASHBOARD_URL: /dashboard/
};
