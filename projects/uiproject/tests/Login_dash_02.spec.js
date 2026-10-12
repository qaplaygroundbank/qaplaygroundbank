const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('DASH-02 Verify logged-in user account information', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
        'standard_user',
        'bank_sauce'
    );
    await expect(page).toHaveURL(/dashboard/);

    await expect(
    page.getByTestId('sidebar-link-accounts')
).toBeVisible();

    await page.screenshot({
        path: 'evidence/DASH-02-Pass.png',
        fullPage: true
    });

});