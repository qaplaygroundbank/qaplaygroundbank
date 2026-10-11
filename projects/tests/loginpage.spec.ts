import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Bank Login Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('Invalid login shows error message', async () => {
    await loginPage.login('wrongUser', 'wrongPass');
    const error = await loginPage.getErrorMessage();
    expect(error.trim()).toBe('The username or password you entered is incorrect.');
  });

  test('Valid login redirects to dashboard', async () => {
    await loginPage.login('standard_user', 'bank_sauce');
    await dashboardPage.assertLoaded();
  });
});