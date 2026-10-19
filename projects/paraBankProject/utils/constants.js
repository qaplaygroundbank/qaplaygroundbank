import appConfig from '../config/app.config.js';

export function getLoginUrl() {
    const environment = process.env.QA_PLAYGROUND_ENV || 'qa';
    const uiConfig = appConfig.getUiConfig(environment);
    return uiConfig.loginUrl;
}

export const VALIDATIONS = {
    WELCOMEPAGE_URL: /overview/
};