import { test } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import billPayData from '../../testData/billPayData.json' assert { type: 'json' };

test.describe('@smoke @profile Bill Pay', () => {

    test.beforeEach(async ({ loginPage, billPayPage }) => {

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

    test.afterEach(async ({ billPayPage }) => {

        await billPayPage.logout();

    });

    test('@smoke @profile Verify Add Biller flow', async ({ billPayPage }) => {

        await billPayPage.clickAddBiller();

        await billPayPage.verifyAddBillerPageDisplayed();

        await billPayPage.addNewBiller(
            billPayData.addBiller.billerName,
            billPayData.addBiller.accountNumber
        );

        await billPayPage.verifyBillerAdded(
            billPayData.addBiller.billerName
        );
    });

    test('@smoke @profile Verify payment date selection', async ({ billPayPage }) => {

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

        await billPayPage.selectPaymentDate(
            billPayData.standardUser.paymentDate
        );

        await billPayPage.verifyPaymentDate(
            billPayData.standardUser.paymentDate
        );
    });

});