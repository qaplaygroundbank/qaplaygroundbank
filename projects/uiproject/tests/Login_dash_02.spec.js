const { test, expect } = require('@playwright/test');

test('DASH-02 Test Case Login', async ({ page }) => {

    // Try to login
    await page.goto('https://qaplayground.com/bank/login');

    await page.locator('#login-username').fill('standard_user');
    await page.locator('#login-password').fill('bank_sauce');
    await page.locator("button[type='submit']").click();

    // Verify dashboard
    await expect(page).toHaveURL(/dashboard/);
    console.log('Dashboard displayed successfully');

    // checking account section
    await expect(page.locator('body')).toContainText('Total Net Worth');
    await expect(page.locator('body')).toContainText('Across 2 accounts');
    console.log('Account summary section is displayed');

    // checking the same in terminal for networht
    const totalNetWorthText = await page.locator('text=Total Net Worth').textContent();
    console.log('Total Net Worth Label:', totalNetWorthText);

    const dashboardContent = await page.locator('body').textContent();

    if (dashboardContent.includes('$17,050.00')) {
        console.log('Net Worth Amount: $17,050.00');
    }

    if (dashboardContent.includes('Across 2 accounts')) {
        console.log('Account Summary: Across 2 accounts');
    }

    // check in logged user 
    await expect(page.locator('body')).toContainText('standard_user');
    await expect(page.locator('body')).toContainText('Welcome back');

    console.log('Logged-in user information verified');

    // check account summary values
    await expect(page.locator('body')).toContainText('$17,050.00');

    console.log('Account summary values are populated');

    // checking unrelated users are not displayed
    await expect(page.locator('body')).not.toContainText('locked_user');
    await expect(page.locator('body')).not.toContainText('problem_user');

    console.log('No unrelated user information displayed');

    console.log('DASH-02 Test Case Passed Successfully');
});