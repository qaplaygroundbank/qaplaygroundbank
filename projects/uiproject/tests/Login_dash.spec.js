const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('DASH-01 Verify successful login and dashboard load', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
        'standard_user',
        'bank_sauce'
    );

    await expect(page).toHaveURL(/dashboard/);

    await page.screenshot({
        path: 'evidence/DASH-01-Pass.png',
        fullPage: true
    });

});