import { test, expect } from '../fixtures/baseFixture.js';
import appConfig from '../config/app.config.js';
import { VALIDATIONS } from '../utils/constants.js';

test('Verify successful bank login @smoke', async ({ page, loginPage }) => {
    const environment = process.env.QA_PLAYGROUND_ENV || 'qa';
    const credentials = appConfig.getUiCredentials(environment);

    await loginPage.openLoginPage();

    await loginPage.login(
        credentials.username,
        credentials.password
    );

    await expect(page).toHaveURL(VALIDATIONS.DASHBOARD_URL);
});
