import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Account Module Tests', () => {

    test(
        'ACC-001: Verify Account section is accessible after successful login @smoke',
        async ({ page, loginPage, accountsPage }) => {

            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            await loginPage.openLoginPage();
            await loginPage.login(username, password);

            await expect(page).toHaveURL(/\/bank\/dashboard/);

            await accountsPage.navigateToAccount();
            await accountsPage.verifyAccountPage();
        }
    );

    test(
        'ACC-002: Verify Account page loads with expected primary UI @smoke',
        async ({ page, loginPage, accountsPage }) => {

            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            await loginPage.openLoginPage();
            await loginPage.login(username, password);

            await expect(page).toHaveURL(/\/bank\/dashboard/);

            await accountsPage.navigateToAccount();
            await accountsPage.waitForAccountLoaded();
            await accountsPage.verifyVisible();
        }
    );

});