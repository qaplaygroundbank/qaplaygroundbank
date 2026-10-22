import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Bank Login Validation', () => {
    test('Verify required credential validation when credentials are missing', {
        tag: ['@smoke', '@regression', '@login']
    }, async ({ loginPage }) => {
        await loginPage.openLoginPage();

        await loginPage.loginButton.click();
        await expect(loginPage.errorBanner).toContainText(
            'Please enter your username.'
        );

        await loginPage.usernameInput.fill('standard_user');
        await loginPage.loginButton.click();
        await expect(loginPage.errorBanner).toContainText(
            'Please enter your password.'
        );
    });
});
