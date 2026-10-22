import { test, expect } from '../../fixtures/baseFixture.js';
import lockedAccountData from '../../testData/lockedAccountData.json' with { type: 'json' };

test.describe('Locked account login', () => {
    test('Verify a locked user account cannot log in @login', async ({
        page,
        loginPage
    }) => {
        await loginPage.openLoginPage();
        await loginPage.login(
            lockedAccountData.username,
            lockedAccountData.password
        );

        await expect(
            page.getByRole('alert').getByText(
                lockedAccountData.errorMessage,
                { exact: true }
            )
        ).toBeVisible();
        await expect(page).toHaveURL(/\/bank\/login$/);
    });
});
