import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Account Module Tests', () => {

    test(
        'ACC-001: Verify Account section is accessible after successful login @smoke',
        async ({ page, loginPage, accountPage }) => {

            // Step 1: Read login credentials loaded from the local .env file
            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            // Step 2: Confirm credentials are available before continuing
            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            // Step 3: Open the SecureBank login page
            await loginPage.openLoginPage();

            // Step 4: Log in using the shared LoginPage method
            await loginPage.login(username, password);

            // Step 5: Verify successful login
            await expect(page).toHaveURL(/\/bank\/dashboard/);

            // Step 6: Navigate to the Account section
            await accountPage.navigateToAccount();

            // Step 7: Verify the Account page opens without an error
            await accountPage.verifyAccountPage();
        }
    );

    test(
        'ACC-002: Verify Account page loads with expected primary UI @smoke',
        async ({ page, loginPage, accountPage }) => {

            // Step 1: Read login credentials loaded from the local .env file
            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            // Step 2: Confirm credentials are available before continuing
            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            // Step 3: Open the SecureBank login page and log in (precondition)
            await loginPage.openLoginPage();
            await loginPage.login(username, password);

            // Step 4: Verify successful login
            await expect(page).toHaveURL(/\/bank\/dashboard/);

            // Step 5: Open the Account section
            await accountPage.navigateToAccount();

            // Step 6: Wait for the Account content to finish loading
            await accountPage.waitForAccountLoaded();

            // Step 7: Verify the primary Account UI is visible
            await accountPage.verifyVisible();
        }
    );

});