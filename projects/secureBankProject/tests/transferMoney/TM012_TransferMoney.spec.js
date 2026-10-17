import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import TransferPage from '../../pages/TransferPage.js';
import testData from '../../testData/transferFundsData.json' with { type: 'json' };
import { VALIDATIONS } from '../../utils/constants.js';

test.describe('Transfer Money Boundary Validation', () => {

    let transferPage;

    test.beforeEach(async ({ page }) => {

        const loginPage = new LoginPage(page);
        transferPage = new TransferPage(page);

        // Login
        await loginPage.openLoginPage();

        await loginPage.login(
            process.env.UI_QA_USERNAME,
            process.env.UI_QA_PASSWORD
        );

        await expect(page).toHaveURL(
            VALIDATIONS.DASHBOARD_URL
        );
    });

    // TM-012 - Verify amount above maximum transfer limit is rejected
    test('TM-012 Verify amount above maximum transfer limit is rejected',
        { tag: ['@smoke', '@transferMoney'] },
        async ({ page }) => {

            const data = testData.aboveMaxTransferAmount;

            // Open Transfer Money page
            await transferPage.clickTransferMenu();

            // Fill transfer form
            await transferPage.fillTransferForm({
                amount: data.amount,
                dateOption: 'today'
            });

            // Review transfer
            await transferPage.clickReview();
            // con
            await transferPage.confirmTransfer();

            // Verify validation message
            await expect(
                transferPage.amountErrorMessage
            ).toBeVisible();

            await expect(
                transferPage.amountErrorMessage
            ).toContainText(
                data.expectedErrorMessage
            );

            // Capture evidence
            await page.screenshot({
                path: `screenshots/tm012_above_limit_${Date.now()}.png`,
                fullPage: true
            });
        });

});