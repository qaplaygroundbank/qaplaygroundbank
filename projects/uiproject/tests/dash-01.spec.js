const { test, expect } = require('@playwright/test');
 
test('Successful Login', async ({ page }) => {
 
  // Open Login Page
  await page.goto('https://qaplayground.com/bank/login');
 
  // Verify page loaded
  await expect(page.locator('h1')).toHaveText('SecureBank');
 
  // Enter Username
  await page.getByPlaceholder('Enter username').fill('standard_user');
 
  // Enter Password
  await page.getByPlaceholder('Enter password').fill('bank_sauce');
 
  // Click Sign In
  await page.getByRole('button', { name: 'Sign In' }).click();
 
  // Verify login success
  await expect(page).not.toHaveURL(/login/);
 
});
 