import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Account Module Tests', () => {


test(
    'ACC-004: Verify account balance is displayed @smoke',
    async ({ page, loginPage, accountsPage }) => {

        const username = process.env.UI_QA_USERNAME;
        const password = process.env.UI_QA_PASSWORD;

        await loginPage.openLoginPage();
        await loginPage.login(username, password);

        await expect(page).toHaveURL(/\/bank\/dashboard/);

        await accountsPage.navigateToAccount();
        await accountsPage.waitForAccountLoaded();

        // Verify account table is visible
        await accountsPage.verifyVisible();

        // Verify the seeded balance is displayed
       const rowCount = await accountsPage.getAccountRowsCount();
         expect(rowCount).toBeGreaterThan(0);

       const accountDetails = await accountsPage.getAccountDetails();

            expect(accountDetails.length).toBeGreaterThan(0);
    },
);
test(
    'ACC-005: Verify account number/details are displayed correctly @smoke',
    async ({ page, loginPage, accountsPage }) => {

        const username = process.env.UI_QA_USERNAME;
        const password = process.env.UI_QA_PASSWORD;

        await loginPage.openLoginPage();
        await loginPage.login(username, password);

        await expect(page).toHaveURL(/\/bank\/dashboard/);

        await accountsPage.navigateToAccount();
        await accountsPage.waitForAccountLoaded();

        await accountsPage.verifyAccountDetails();

        const accountDetails = await accountsPage.getAccountDetails();
    
        expect(accountDetails.length).toBeGreaterThan(0);

        for (const account of accountDetails) {
             expect(account.trim()).not.toBe('');
            }
    }
);

    

});