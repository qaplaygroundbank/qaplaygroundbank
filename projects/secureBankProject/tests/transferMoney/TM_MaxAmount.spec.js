import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import TransferPage from '../../pages/TransferPage.js';
 
test.describe('Transfer Money - Maximum Amount', () => {
  test('Verify maximum transfer amount is accepted', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transferPage = new TransferPage(page);
 
    await loginPage.openLoginPage();
    await loginPage.login(
      process.env.UI_QA_USERNAME,
      process.env.UI_QA_PASSWORD
    );
 
    await transferPage.clickTransferMenu();
 
    await transferPage.fillTransferForm({
  dateOption: 'today'
});
 
    await transferPage.clickReview();
 
    await expect(transferPage.amountErrorMessage).not.toBeVisible();
    await expect(transferPage.confirmTransferButton).toBeVisible();
 await expect(transferPage.confirmTransferButton).toBeVisible();
 
await transferPage.confirmTransferButton.click();
 
await expect(
  page.getByText('Transfer Successful')
).toBeVisible();
 
});
});
 
 