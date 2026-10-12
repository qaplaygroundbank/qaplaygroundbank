const { test, expect } = require('@playwright/test');

test('DASH-01 login', async ({ page }) => {

    await page.goto('https://qaplayground.com/bank/login');


    const usernameField = page.locator("//input[@id='login-username']");
    await expect(usernameField).toBeVisible();

    const passwordField = page.locator("//input[@id='login-password']");
    await expect(passwordField).toBeVisible();

    await usernameField.fill('standard_user');
    await passwordField.fill('bank_sauce');

    const loginButton = page.locator("//button[@type='submit']");

    await loginButton.click();

    console.log("Current URL:", page.url());
    await page.waitForTimeout(5000);

    // need to check current url
    console.log("Current URL After Login:", page.url());



    // checking User Redirected to Dashboard
    await expect(page).toHaveURL(/dashboard/i);

    // checking Dashboard loaded successfully
    await expect(page.locator('body')).toBeVisible();

    console.log('Dashboard loaded successfully without blocking errors');
});