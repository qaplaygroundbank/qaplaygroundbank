import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import { VALIDATIONS } from '../../utils/constants.js';

test('Verify successful login with valid SecureBank credentials', async ({
    page,
    loginPage
}) => {
    const environment = process.env.QA_PLAYGROUND_ENV || 'qa';
    const credentials = appConfig.getUiCredentials(environment);

    await loginPage.openLoginPage();
    await loginPage.login(credentials.username, credentials.password);

    await expect(page).toHaveURL(VALIDATIONS.DASHBOARD_URL);
});
