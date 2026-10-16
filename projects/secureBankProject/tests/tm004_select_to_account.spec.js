import { test, expect } from '@playwright/test'
import LoginPage from '../pages/LoginPage.js'
import { getUiCredentials } from '../config/app.config.js'
// import TransferMoneyPage from '../pages/TransferMoneyPage.js';
import TransferMoneyPage from '../pages/TransferPage.js'
// import TransferPage from '../pages/TransferPage.js'

// test('TM-004 - Verify To Account can be selected', async ({ page }) => {
test('TM-004 - Verify To Account can be selected @smoke', async ({ page }) => {
    const credentials = getUiCredentials('qa');
    const loginPage = new LoginPage(page);
    // const transferPage = new TransferPage(page);
    const transferMoneyPage = new TransferMoneyPage(page);
    await loginPage.openLoginPage();
    await loginPage.login(
        credentials.username,
        credentials.password
    )
    await expect(page).toHaveURL(/.*\/bank\/dashboard/);
    await transferMoneyPage.openTransferMoney();
    await expect(page).toHaveURL(/.*\/bank\/transfer/);
    //await transferMoneyPage.selectFromAccount(/Everyday Checking/i);
    await transferMoneyPage.chooseFromAccount(/Everyday Checking/i);
    //await expect(transferMoneyPage.toAccount).toBeEnabled();
    await transferMoneyPage.chooseToAccount(/High-Yield Savings/i);
    //await expect(transferMoneyPage.toAccountSelect).toHaveValue(/High-Yield Savings/i);
    //await transferMoneyPage.selectToAccount(/High-Yield Savings/i);
    // await transferMoneyPage.selectToAccount(/High-Yield Savings/i);

    await expect(transferMoneyPage.toAccountSelect.locator('[data-slot="select-value"]')).not.toHaveText('Select Account');
});