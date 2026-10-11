import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { TransferPage } from './pages/TransferPage';

test.describe('Bank transfer', () => {
  test('Transfer flow completes successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transferPage = new TransferPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'bank_sauce');
    await page.waitForURL(/\/bank\/dashboard$/);

    await transferPage.goto();
    await transferPage.assertLoaded();
    await transferPage.completeTransfer('Everyday Checking', 'High-Yield Savings', '100', 'Rent');
  });

  test('Transfer validation shows error when amount is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transferPage = new TransferPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'bank_sauce');
    await page.waitForURL(/\/bank\/dashboard$/);

    await transferPage.goto();
    await transferPage.assertLoaded();
    await transferPage.selectFromAccount('Everyday Checking');
    await transferPage.selectToAccount('High-Yield Savings');
    await transferPage.assertAmountValidationMessage();
  });
});
