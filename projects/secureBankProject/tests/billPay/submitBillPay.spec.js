import { test } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import billPayData from '../../testData/billPayData.json' with { type: 'json' };

test.describe('Bill Pay', () => {

    test.beforeEach(async ({ loginPage, billPayPage }) => {
        const environment =
            process.env.QA_PLAYGROUND_ENV || 'qa';

        const credentials =
            appConfig.getUiCredentials(environment);

        // Login 

        await loginPage.openLoginPage();
        await loginPage.login(
            credentials.username,
            credentials.password
        );

        // Navigate to Bill Pay
        await billPayPage.navigateToBillPay();
        await billPayPage.verifyBillPayPageLoaded();

    });

    test.afterEach(async ({ billPayPage }) => {
        await billPayPage.logout()

    }),

        test('Verify successful bill payment', { tag: ['@smoke', '@regression', '@BillPay'] }, async ({
            loginPage,
            billPayPage
        }) => {

            await billPayPage.payBill(billPayData.standardUser);
            await billPayPage.verifyBillPaymentSuccess();

        });

});