import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import accountsData from '../../testData/accountsData.json' assert { type: 'json' };
test.describe('Account Module Tests', () => {

   test(
    'ACC-004: Verify account balance is displayed @smoke',
    async ({ page, loginPage, accountsPage }) => {

        const environment =
            process.env.QA_PLAYGROUND_ENV || 'qa';

        const { username, password } =
            appConfig.getUiCredentials(environment);

        expect(
            username,
            `Username is not configured for environment "${environment}"`
        ).toBeTruthy();

        expect(
            password,
            `Password is not configured for environment "${environment}"`
        ).toBeTruthy();

        await loginPage.openLoginPage();
        await loginPage.login(username, password);

        await expect(page).toHaveURL(/\/bank\/dashboard/);

        await accountsPage.navigateToAccount();
        await accountsPage.waitForAccountLoaded();

        await accountsPage.verifyVisible();

        const accountBalance =
            await accountsPage.getAccountBalance();

        expect(accountBalance).toBe(
            accountsData.checkingAccount.balance
        );
    }
);


test(
    'ACC-005: Verify account number/details are displayed correctly @smoke',
    async ({ page, loginPage, accountsPage }) => {

        const environment =
            process.env.QA_PLAYGROUND_ENV || 'qa';

        const { username, password } =
            appConfig.getUiCredentials(environment);

        expect(
            username,
            `Username is not configured for environment "${environment}"`
        ).toBeTruthy();

        expect(
            password,
            `Password is not configured for environment "${environment}"`
        ).toBeTruthy();

        await loginPage.openLoginPage();
        await loginPage.login(username, password);

        await expect(page).toHaveURL(/\/bank\/dashboard/);

        await accountsPage.navigateToAccount();
        await accountsPage.waitForAccountLoaded();

        const accountDetails =
            await accountsPage.getAccountDetails();

        const checkingAccount = accountDetails.find(account =>
            account.includes(
                accountsData.checkingAccount.accountNumber
            )
        );

        expect(
            checkingAccount,
            `Account ${accountsData.checkingAccount.accountNumber} not found`
        ).toBeTruthy();

        expect(checkingAccount).toContain(
            accountsData.checkingAccount.accountName
        );

        expect(checkingAccount).toContain(
            accountsData.checkingAccount.accountNumber
        );

        expect(checkingAccount).toContain(
            accountsData.checkingAccount.accountType
        );

        const accountBalance =
    await accountsPage.getCheckingAccountBalance();

        expect(accountBalance).toBe(
            accountsData.checkingAccount.balance
        );
    }
);;

});
