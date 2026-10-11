const { test, expect } = require('@playwright/test');

async function loginToBank(page) {
  await page.goto('https://qaplayground.com/bank/login');

  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('bank_sauce');
  await page.getByRole('button', { name: /sign in to securebank/i }).click();

  await expect(page).toHaveURL(/\/bank\/dashboard$/);
  await expect(page.getByText('Welcome back, Alex')).toBeVisible();
  await expect(page.getByText('Total Net Worth')).toBeVisible();
}

test('Login to Bank application', async ({ page }) => {
  await loginToBank(page);
});