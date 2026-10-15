import { test } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import billPayData from '../../testData/billPayData.json' with { type: 'json' };

test.describe('Bill Pay Cancel bill', () => {

    test('BP-017 - Cancel bill payment without creating a payment @smoke',
        async ({ loginPage, billPayPage }) => {

            // Step 1: Get QA credentials.
            const environment =
                process.env.QA_PLAYGROUND_ENV || 'qa';

            const credentials =
                appConfig.getUiCredentials(environment);

            await loginPage.openLoginPage();

            await loginPage.login(
                credentials.username,
                credentials.password
            );

            await billPayPage.navigateToBillPay();

            await billPayPage.verifyBillPayPageLoaded();

            await billPayPage.selectFirstFromAccount();

            await billPayPage.searchBiller(billPayData.standardUser.biller);

            await billPayPage.selectBiller();

            await billPayPage.enterAmount(billPayData.standardUser.amount);

            await billPayPage.clickCancelPayment();

            await billPayPage.verifyPaymentCancelled();

            await billPayPage.logout();
        }
    );
});