import { test, expect } from '@playwright/test'
import LoginPage from '../pages/LoginPage.js'
import { getUiCredentials } from '../config/app.config.js'
import TransferPage from '../pages/TransferPage.js'
import transferData from '../testData/TransferFundsData.json' assert { type: 'json' };

test('TM-004 - Verify To Account can be selected @smoke', async ({ page }) => {
    const credentials = getUiCredentials('qa');
    const loginPage = new LoginPage(page);
    const transferPage = new TransferPage(page);
    await loginPage.openLoginPage();
    await loginPage.login(
        credentials.username,
        credentials.password
    )
    await expect(page).toHaveURL(/.*\/bank\/dashboard/);
    await transferPage.openTransferTab();
    await expect(page).toHaveURL(/.*\/bank\/transfer/);
    await transferPage.chooseFromAccount(transferData.TM004.fromAccount);
    await transferPage.chooseToAccount(transferData.TM004.toAccount);
    await expect(transferPage.toAccountSelectedValue).not.toHaveText(transferData.TM004.defaultAccountText);
});