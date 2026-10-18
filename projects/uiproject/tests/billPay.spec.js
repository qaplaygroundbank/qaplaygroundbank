const { test, expect } = require('@playwright/test');

test('Verify validation message when Amount is zero', async ({ page }) => {
// Login
    await page.goto('https://qaplayground.com/bank/login');
 
    await page.locator('input[name="username"]').fill('standard_user');
    await page.locator('input[name="password"]').fill('bank_sauce');
 
    await page.getByRole('button', { name: 'Sign In' }).click();



    await page.locator("//span[text()='Bill Pay']").click();

    await page.locator("//span[text()='Select account']").click();

    await page.getByText('Everyday Checking').click();

    await page.getByTestId('biller-search-input').fill('City Electric Co.');

    await page.getByText('City Electric Co.').click();

    await page.getByTestId('bill-amount-input').fill('0');

    await page.getByTestId('review-bill-btn').click();

    await expect(
    page.getByTestId('bill-pay-error')).toHaveText('Please enter a valid amount.');
});