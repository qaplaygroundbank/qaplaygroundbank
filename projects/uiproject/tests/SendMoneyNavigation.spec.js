import { test, expect } from '../fixtures/baseFixture.js';
import bankData from '../data/bankData.json' with { type: 'json' };

test('Verify Send Money page navigation after login',
  async ({ page, loginPage }) => {

    await loginPage.openLoginPage();

    await loginPage.login(
      bankData.standardUser.username,
      bankData.standardUser.password
    );

    await page.getByTestId('sidebar-link-send-money').click();

    await expect(
      page.getByRole('heading', { name: 'Send Money' })
    ).toBeVisible();

    console.log('Send Money Page Opened Successfully');
});