import { test, expect } from '../fixtures/baseFixture.js';
import bankData from '../data/bankData.json' with { type: 'json' };
import { VALIDATIONS } from '../utils/constants.js';

test.describe('Secure Bank Login Test', () => {

    test('verify successful login', async ({ page, loginPage }) => {

        // Navigate to the Secure Bank Login page
        await loginPage.openLoginPage();

        // Login using valid test data
        await loginPage.login(
            bankData.standardUser.username,
            bankData.standardUser.password
        );

        // Verify user is redirected to dashboard page
        await expect(page).toHaveURL(VALIDATIONS.DASHBOARD_URL);

    });

});