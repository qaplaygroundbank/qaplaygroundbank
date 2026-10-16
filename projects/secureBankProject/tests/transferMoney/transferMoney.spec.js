import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import TransferPage from '../../pages/TransferPage.js';

test.describe('Transfer Money Page Tests', () => {
  let loginPage;
  let transferPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transferPage = new TransferPage(page);

    await loginPage.openLoginPage();

    const username = process.env.UI_QA_USERNAME;
    const password = process.env.UI_QA_PASSWORD;

    expect(username, 'UI_QA_USERNAME is not configured').toBeTruthy();
    expect(password, 'UI_QA_PASSWORD is not configured').toBeTruthy();

    await loginPage.login(username, password);

    const transferLink = page.getByRole('link', {
      name: 'Transfer',
      exact: true
    });

    await expect(transferLink).toBeVisible();
    await transferLink.click();

    await expect(transferPage.pageHeading).toBeVisible();
    await expect(transferPage.pageHeading).toHaveText('Transfer Money');
  });
  test('TM-001: Transfer Money Validations @transferMoney @regression  ', async () => {

    await expect(transferPage.fromAccountSelect).toBeVisible();
    await expect(transferPage.toAccountSelect).toBeVisible();
    await expect(transferPage.amountInput).toBeVisible(); 

    await expect(transferPage.transferDateTodayRadio).toBeVisible();
    await expect(transferPage.transferDateScheduleRadio).toBeVisible();

    await expect(transferPage.reviewTransferButton).toBeVisible();
    await expect(transferPage.cancelButton).toBeVisible();
  }
  );

  test('TM-002: Transfer Money - Select From Account @transferMoney @smoke ', async ({ page }) => {

    await expect(transferPage.fromAccountSelect).toBeVisible();

    await transferPage.fromAccountSelect.click();

    const savingsAccount = page.getByText(
      'High-Yield Savings — $12,800.00',
      { exact: true }
    );

    await expect(savingsAccount).toBeVisible();

    await savingsAccount.click();

    await expect(transferPage.fromAccountSelect)
      .toHaveText(/acc-savings-1/);

  }
  );

});
