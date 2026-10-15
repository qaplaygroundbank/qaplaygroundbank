import { test, expect } from '@playwright/test';
import TransferFundsPage from '../pages/TransferFundsPage.js';
import LoginPage from '../pages/LoginPage.js';
import testData from '../testData/transferFundsData.json' assert { type: 'json' };

 
test.describe('Transfer funds ParaBank', () => {

  let transferFundsPage;
 
  // test.beforeEach sits outside the test() block
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    transferFundsPage = new TransferFundsPage(page);
 
    // 1. Login to application
    await loginPage.openLoginPage();
    await loginPage.login(
      process.env.UI_QA_USERNAME,
      process.env.UI_QA_PASSWORD
    );
    await expect(page).toHaveURL(/overview\.htm/);
  });
 
  // Now define the test() block
  test('Complete money transfer with auto-selected accounts from testdata.json file and verify success', async ({ page }) => {
    const data = testData.positiveTransferData;
 
    await transferFundsPage.openTransferFunds();

    await transferFundsPage.transferFunds(data);

    await expect(transferFundsPage.transferSuccessMessage).toBeVisible();
    await expect(transferFundsPage.transferSuccessMessage).toHaveText(data.successMessage);
 
    await page.screenshot({
      path: `screenshots/transfer-success-${Date.now()}.png`,
      fullPage: true,
    });
  });

   test('Should display error message when transfer amount is blank', async ({ page }) => {
    const data = testData.blankTransferAmount;
 
    await transferFundsPage.openTransferFunds();
    await transferFundsPage.transferFunds(data);

    await expect(transferFundsPage.errorMessage).toBeVisible();
    await expect(transferFundsPage.errorMessage).toHaveText(data.expectedErrorMessage);

    await page.screenshot({
      path: `screenshots/transfer-error-zero-amount-${Date.now()}.png`,
      fullPage: true,
    });
  });
});
 