import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Bank Login - Password Visibility', () => {
    test('Verify the password visibility icon controls password masking', async ({
        page,
        loginPage
    }) => {
        const password = 'bank_sauce';

        await loginPage.openLoginPage();

        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
        await loginPage.passwordInput.fill(password);

        await loginPage.togglePasswordVisibility();

        await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
        await expect(loginPage.passwordInput).toHaveValue(password);
        await expect(
            page.getByRole('button', { name: 'Hide password' })
        ).toBeVisible();

        await loginPage.togglePasswordVisibility();

        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
        await expect(loginPage.passwordInput).toHaveValue(password);
        await expect(
            page.getByRole('button', { name: 'Show password' })
        ).toBeVisible();
    });
});
