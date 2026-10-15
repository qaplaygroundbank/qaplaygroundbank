import appConfig from '../config/app.config.js';

const environment =
    process.env.QA_PLAYGROUND_ENV || 'qa';

const uiConfig = appConfig.getUiConfig(environment);

export const URLS = {
    LOGIN_PAGE: uiConfig.loginUrl
};

export const VALIDATIONS = {
    DASHBOARD_URL: /dashboard/,
    BILL_PAY_CONFIRMATION_URL: /bill-pay\/confirmation/,
    PROFILE_URL : /profile/,
    PROFILE_TITLE: /Profile & Settings/,
    PHONE_VALIDATION_MESSAGE: 'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
};
