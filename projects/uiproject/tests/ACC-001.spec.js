const { test, expect } = require('@playwright/test');
 
test('ACC-001 | Account section is accessible after successful login', async ({ page }) => {
 
    await page.goto('https://qaplayground.com/bank/login');
 
    await page.getByPlaceholder('Enter username').fill('standard_user');
    await page.getByPlaceholder('Enter password').fill('bank_sauce');
 
    await page.getByRole('button', { name: 'Sign In' }).click();
 
    // Navigate to Accounts
    await page.getByTestId('sidebar-link-accounts').click();
 
    // Verify Account page opened
    await expect(page).toHaveURL(/accounts/);
 
    // Verify Account page content visible
    await expect(page.locator('body')).toContainText('Accounts');
});
 
