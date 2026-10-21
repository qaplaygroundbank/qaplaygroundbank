import { test } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import billPayData from '../../testData/billPayData.json' with { type: 'json' };

test.describe('Bill Pay', () => {

    test.beforeEach(async ({ loginPage }) => {
        const environment =
            process.env.QA_PLAYGROUND_ENV || 'qa';

        const credentials =
            appConfig.getUiCredentials(environment);

        await loginPage.openLoginPage();
        await loginPage.login(
            credentials.username,
            credentials.password
        );
    });

    test.afterEach(async ({ billPayPage }) => {
        await billPayPage.logout();
    });

    test('Verify maximum bill payment amount is accepted', { tag: ['@smoke', '@regression', '@BillPay'] }, async ({
        billPayPage
    }) => {

        await billPayPage.navigateToBillPay();
        await billPayPage.verifyBillPayPageLoaded();

        await billPayPage.selectFromAccount(billPayData.standardUser.fromAccount);
        await billPayPage.searchBiller(billPayData.standardUser.biller);
        await billPayPage.selectBiller();

        await billPayPage.enterAmount(billPayData.standardUser.maximumBillAmount);
        await billPayPage.clickReviewPayment();

        await billPayPage.verifyConfirmPaymentPopup();
        await billPayPage.closeConfirmPaymentDialog();
    });

});
