import { test } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import TransferPage from '../../pages/TransferPage.js';
import appConfig from '../../config/app.config.js';

test.describe('Transfer Money Validation Tests', () => {
    let transferPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        transferPage = new TransferPage(page);

        const credentials = appConfig.getUiCredentials(
            process.env.QA_PLAYGROUND_ENV || 'qa'
        );

        await loginPage.openLoginPage();
        await loginPage.login(
            credentials.username,
            credentials.password
        );

        await transferPage.openTransferPage();
    });

    test('TM005 - Verify To Account is mandatory @regression @TransferMoney', async () => {
            await transferPage.selectFromAccount();
            await transferPage.verifyToAccountEnabled();
            await transferPage.enterAmount('100');
            await transferPage.clickReviewTransfer();
            await transferPage.verifyToAccountMandatoryError();
            await transferPage.verifyTransferNotSubmitted();
        }
    );
});