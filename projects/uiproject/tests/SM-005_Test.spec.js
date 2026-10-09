const { test, expect } = require('@playwright/test');

test('Verify Payee field is displayed and select first payee', async ({ page }) => {

    // Login
    await page.goto('https://qaplayground.com/bank/login');

    await page.locator('input[name="username"]').fill('standard_user');
    await page.locator('input[name="password"]').fill('bank_sauce');

    await page.getByRole('button', { name: 'Sign In' }).click();

    // Send Money page
    await page.getByTestId('sidebar-link-send-money').click();

    // Send Money page loaded
    await expect(
        page.getByRole('heading', { name: 'Send Money' })
    ).toBeVisible();

    const payeeDropdown = page.getByRole('combobox', { name: 'Payee' });
    await expect(payeeDropdown).toBeVisible();

    await payeeDropdown.click();

    const firstPayee = page.getByRole('option').first();

    const payeeName = (await firstPayee.textContent()).trim();
    console.log(`Selected Payee: ${payeeName}`);

    await firstPayee.click();
});