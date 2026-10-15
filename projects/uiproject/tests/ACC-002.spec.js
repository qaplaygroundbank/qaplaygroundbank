const { test, expect } = require('@playwright/test');
 
test('ACC-002 | Account page loads with expected primary UI', async ({ page }) => {
 
    await page.goto('https://qaplayground.com/bank/login');
 
    await page.getByPlaceholder('Enter username').fill('standard_user');
    await page.getByPlaceholder('Enter password').fill('bank_sauce');
    await page.getByRole('button', { name: 'Sign In' }).click();
 
    await page.getByTestId('sidebar-link-accounts').click();
 
    // Account page loaded
    await expect(page.getByTestId('bank-main-content')).toBeVisible();
 
    // Verify URL
    await expect(page).toHaveURL(/accounts/);
 
    // Verify no blank page
    await expect(page.locator('body')).not.toBeEmpty();
});