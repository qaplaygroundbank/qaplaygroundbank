import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import LoginPage from '../../pages/LoginPage.js';
import TransferPage from '../../pages/TransferPage.js';
import testData from '../../testData/TransferFundsData.json' assert { type: 'json' };

// Guaranteed screenshot folder (created if missing)
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const shot = (name) => path.join(SCREENSHOT_DIR, `${name}-${Date.now()}.png`);

test.describe('Transfer Money Negative Flow', () => {
  let transferPage;

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

  test('Complete money transfer with auto-selected accounts and verify failure for high excess amount transfer @regression @transfermoney', async ({ page }) => {
    const data = testData.transferHighAmount;

    // 2. Click Transfer on the left menu
    await transferPage.clickTransferMenu();

    // 3. Auto-select accounts and fill details from JSON fixture
    
    await transferPage.fillTransferFormWithDistinctAccounts(data);

    // 4. Click Review Transfer button
    await transferPage.clickReview();
    await expect(transferPage.confirmTransferButton).toBeVisible();

    await page.screenshot({ path: shot('transfer-confirm-button visible'), fullPage: true });

    // 5. Click Confirm Transfer button in the confirmation popup
    await transferPage.confirmTransfer();

    // 6. Verify failure message and take screenshot of the final screen
    await expect(transferPage.amountErrorMessage).toBeVisible();
    await expect(transferPage.amountErrorMessage).toContainText(data.expectedErrorMessage);

    await page.screenshot({ path: shot('transfer-fail'), fullPage: true });
  });

  test('Should display error message when transfer amount is negative @regression @transfermoney', async ({ page }) => {
    const data = testData.transferNegativeAmount;

    // 2. Open Transfer page via sidebar menu
    await transferPage.clickTransferMenu();

    // 3. Fill form with negative amount
  
    await transferPage.fillTransferFormWithDistinctAccounts(data);

    // 4. Click Review Transfer
    await transferPage.clickReview();

    // 5. Verify the error message appears on the same screen
    await expect(transferPage.amountErrorMessage).toBeVisible();
    await expect(transferPage.amountErrorMessage).toContainText(data.expectedErrorMessage);

    // 6. Confirm popup button must NOT be visible
    await expect(transferPage.confirmTransferButton).toBeHidden();

    // 7. Screenshot of validation error
    await page.screenshot({ path: shot('transfer-error-negative-amount'), fullPage: true });
  });
});