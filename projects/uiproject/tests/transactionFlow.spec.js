import { test, expect } from '../fixtures/baseFixture.js';

//Verify an authenticated user can navigate to the Transaction area.
//Verify the Transaction page renders its available transaction controls and content.
test('Verify Transactions UI loads successfully', async ({ page, transactionsPage }) => {


    await page.goto('https://qaplayground.com/bank/login');

    await page.getByPlaceholder('Enter username')
        .fill('standard_user');

    await page.getByPlaceholder('Enter password')
        .fill('bank_sauce');

    await page.getByRole('button', { name: 'Sign In' })
        .click();

    await expect(
        page.getByRole('heading', {
            name: /Welcome back, Alex/i
        })
    ).toBeVisible();

    await transactionsPage.navigateToTransactions();

    await transactionsPage.waitForTransactionLoaded();

    await transactionsPage.verifyTransactionPage();

    await transactionsPage.verifyVisible();
});