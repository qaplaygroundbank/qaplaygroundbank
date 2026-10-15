const { test, expect } = require('@playwright/test');
 
test('Launch Dashboard', async ({ page }) => {
 
    // Open Login Page
    await page.goto('https://qaplayground.com/bank/login');
 
    // Login
    await page.getByPlaceholder('Enter username')
        .fill('standard_user');
 
    await page.getByPlaceholder('Enter password')
        .fill('bank_sauce');
 
    await page.getByRole('button', { name: 'Sign In' })
        .click();
 
    // Verify Dashboard Loaded
    await expect(page).toHaveURL(/dashboard/);
 
    // Verify Dashboard is visible
    await expect(page.getByText('Dashboard')).toBeVisible();
 
    console.log('Dashboard launched successfully');
});
