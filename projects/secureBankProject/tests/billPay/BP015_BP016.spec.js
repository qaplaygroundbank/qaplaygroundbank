import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import billPayData from '../../testData/billPayData.json' with { type: 'json' };

test.describe('Bill Pay', () => {

    test.beforeEach(async ({
        loginPage,
        billPayPage
    }) => {

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

    });

    test.afterEach(async ({
        billPayPage
    }) => {

        await billPayPage.logout();

    });

    test(
        'BP-015 Verify invalid amount is not accepted',
        async ({
            billPayPage,
            page
        }) => {

            await billPayPage.selectFromAccount(
                'Everyday Checking'
            );

            await billPayPage.searchBiller(
                'City Electric Co.'
            );

            await billPayPage.selectBiller();

            await billPayPage.enterAmount('0');

            await billPayPage.clickReviewPayment();

            await expect(
                page.getByText(
                    'Please enter a valid amount.'
                )
            ).toBeVisible();

        }
    );

    test(
        'BP-016 Verify Confirm Bill Payment popup is displayed',
        async ({
            billPayPage
        }) => {

            await billPayPage.selectFromAccount(
                billPayData.standardUser.fromAccount
            );

            await billPayPage.searchBiller(
                billPayData.standardUser.biller
            );

            await billPayPage.selectBiller();

            await billPayPage.enterAmount(
                billPayData.standardUser.amount
            );

            await billPayPage.clickReviewPayment();

            await billPayPage.verifyConfirmPaymentPopup();

            await billPayPage.clickConfirmPayment();

            await billPayPage.verifyBillPaymentSuccess();

        }
    );

});