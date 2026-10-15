const { test, expect } = require('@playwright/test');


test('Verify validation message when Amount is negative', async ({ page }) => {

    // Login
    await page.goto('https://qaplayground.com/bank/login');
 
    await page.locator('input[name="username"]').fill('standard_user');
    await page.locator('input[name="password"]').fill('bank_sauce');
 
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Open Bill Pay
    await page.locator("//span[text()='Bill Pay']").click();

    await page.locator("//span[text()='Select account']").click();
    
    await page.getByTestId('bill-pay-from-option')
              .first()
              .click();

    // Select valid Biller
    await page.getByTestId('biller-search-input')
              .fill('City Electric Co.');

    await page.getByText('City Electric Co.')
              .click();

    // Enter negative Amount
    await page.getByTestId('bill-amount-input')
              .fill('-100');

    // Click Review Payment
    await page.getByTestId('review-bill-btn')
              .click();

    // Verify validation message
    await expect(
        page.getByTestId('bill-pay-error')
    ).toHaveText('Please enter a valid amount.');
});