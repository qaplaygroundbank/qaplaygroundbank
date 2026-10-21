import { test, expect } from '../../fixtures/baseFixture.js';

test('Verify invalid username/password cannot authenticate', async ({
    page,
    loginPage
}) => {
    await loginPage.openLoginPage();
    await loginPage.login('invalid_user', 'invalid_password');

    await expect(page.getByTestId('login-error-banner')).toContainText(
        'The username or password you entered is incorrect.'
    );
    await expect(page).toHaveURL(/\/bank\/login$/);
});
