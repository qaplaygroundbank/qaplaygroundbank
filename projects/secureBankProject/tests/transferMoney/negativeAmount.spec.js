import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import TransferPage from '../../pages/TransferPage.js';
import testData from '../../testData/transferFundsData.json' assert { type: 'json' };
 
test.describe('Transfer Money Negative Flow', () => {
  // let loginPage;
  let transferPage;
 
  // test.beforeEach sits outside the test() block
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    transferPage = new TransferPage(page);
 
    // 1. Login to application
    await loginPage.openLoginPage();
    await loginPage.login(
      process.env.UI_QA_USERNAME,
      process.env.UI_QA_PASSWORD
    );
    await expect(page).toHaveURL(/.*bank\/(dashboard|overview)?/);
  });
 
  // Now define the test() block
  test('Complete money transfer with auto-selected accounts and verify Failure @regression', async ({ page }) => {
    const data = testData.transferHighAmount;
 
    // 2. Click Transfer on the left menu
    await transferPage.clickTransferMenu();
 
    // 3. Auto-select accounts and fill details from JSON fixture
    await transferPage.fillTransferForm(data);
 
    // 4. Click Review Transfer button
    await transferPage.clickReview();
 
    // 5. Click Confirm Transfer button in the confirmation popup
    await transferPage.confirmTransfer();
 
    // 6. Verify failure  message and take screenshot of the final screen
    await expect(transferPage.amountErrorMessage).toBeVisible();
    await expect(transferPage.amountErrorMessage).toContainText(data.expectedErrorMessage);
 
    await page.screenshot({
      path: `screenshots/transfer-Fail-${Date.now()}.png`,
      fullPage: true,
    });
  });

   test('Should display error message when transfer amount is negative @regression', async ({ page }) => {
    const data = testData.transferNegativeAmount;
 
    // 2. Open Transfer Page via sidebar menu[span_14](start_span)
    await transferPage.clickTransferMenu();
 
    // 3. Fill form with amount with negative
    await transferPage.fillTransferForm(data);
 
    // 4. Click Review Transfer[span_15](start_span)
    await transferPage.clickReview();
 
    // 5. Verify the error message appears on the same screen
    await expect(transferPage.amountErrorMessage).toBeVisible();
    await expect(transferPage.amountErrorMessage).toHaveText(data.expectedErrorMessage);
 
    // 6. Confirm popup button is NOT triggered/visible
    await expect(transferPage.confirmTransferButton).toBeHidden();
 
    // 7. Take screenshot of validation error
    await page.screenshot({
      path: `screenshots/transfer-error-negtive-amount-${Date.now()}.png`,
      fullPage: true,
    });
  });
});
 