import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import TransferPage from '../../pages/TransferPage.js';
import testData from '../../testData/TransferFundsData.json' with { type: 'json' };

test('Verify Transfer Money Review Details', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transferPage = new TransferPage(page);

  // Login to application
  await loginPage.openLoginPage();
  await loginPage.login(
    process.env.UI_QA_USERNAME,
    process.env.UI_QA_PASSWORD
  );

  // Enter valid transfer details
  await transferPage.clickTransferMenu();
  await transferPage.fillTransferForm(testData.validTransferToday);

  // Open and verify review step
  await transferPage.clickReview();
  await expect(transferPage.confirmTransferButton).toBeVisible();
  const popup = page.getByRole('dialog');
 await expect(popup.getByText('Everyday Checking')).toBeVisible();
  await expect(popup.getByText('High-Yield Savings')).toBeVisible();
  await expect(popup.getByText('$250.00')).toBeVisible();
  const today = new Date().toLocaleDateString('en-CA');
  await expect(popup.getByText(today)).toBeVisible();
});

test('Verify Confirm Transfer Popup Closes Using X Button', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transferPage = new TransferPage(page);

  await loginPage.openLoginPage();
  await loginPage.login(
    process.env.UI_QA_USERNAME,
    process.env.UI_QA_PASSWORD
  );

  await transferPage.clickTransferMenu();
  await transferPage.fillTransferForm(testData.validTransferToday);
  await transferPage.clickReview();

  const popup = page.getByRole('dialog');
  await expect(popup).toBeVisible();

  await popup.getByRole('button', { name: 'Close' }).click();

  await expect(popup).toBeHidden();
  await expect(transferPage.reviewTransferButton).toBeVisible();
});
