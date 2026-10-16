import { test, expect } from '@playwright/test'
import LoginPage from '../pages/LoginPage.js'
import { getUiCredentials } from '../config/app.config.js'
import TransferPage from '../pages/TransferPage.js'
import transferData from '../testData/TransferFundsData.json' assert { type: 'json' };

test('TM-003 - Verify From Account is mandatory @smoke', async ({ page }) => {
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
    await expect(transferPage.fromAccountSelect).toContainText(transferData.TM003.fromAccountDefaultText);
    await transferPage.enterAmount(transferData.TM003.amount);

    await transferPage.clickReviewTransfer();
    await expect(transferPage.fromAccountError).toBeVisible();
});