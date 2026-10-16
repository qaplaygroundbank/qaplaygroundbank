import { test, expect } from '@playwright/test'
import LoginPage from '../pages/LoginPage.js'
import { getUiCredentials } from '../config/app.config.js'
import TransferMoneyPage from '../pages/TransferPage.js'
//test('TM-003 - Verify From Account is mandatory', async ({ page }) => {
test('TM-003 - Verify From Account is mandatory @smoke', async ({ page }) => {
    const credentials = getUiCredentials('qa');
    const loginPage = new LoginPage(page);
    const transferMoneyPage = new TransferMoneyPage(page);
    await loginPage.openLoginPage();
    
    await loginPage.login(
        credentials.username,
        credentials.password
    )
    await expect(page).toHaveURL(/.*\/bank\/dashboard/);
    await transferMoneyPage.openTransferMoney();
    //await page.getByTestId('sidebar-link-transfer').click();
    await expect(page).toHaveURL(/.*\/bank\/transfer/);
    await expect(transferMoneyPage.fromAccountSelect).toContainText('Select account');
    await transferMoneyPage.enterAmount('100');
    await transferMoneyPage.clickReviewTransfer();
    await expect(transferMoneyPage.fromAccountError).toBeVisible();
});