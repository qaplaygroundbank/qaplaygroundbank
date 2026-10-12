import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import DashboardPage from '../pages/DashboardPage.js';
import users from '../../../testdata/users.json' with { type: 'json' };

// Optional, opt-in debug hook: when KEEP_BROWSER_OPEN is set the Playwright
// Inspector pauses after the test so you can inspect the page. Normal test
// timeout handling is left unchanged; use `--debug` for full Inspector control.
test.afterEach(async ({ page }) => {
  if (process.env.KEEP_BROWSER_OPEN) {
    await page.pause();
  }
});

test('Verify dashboard is displayed after successful authentication', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Open the login page and check the fields are displayed
  await loginPage.openLoginPage();
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();

  // Steps 2 & 3: Enter valid credentials and click Sign In
  await loginPage.login(users.standardUser.username, users.standardUser.password);

  // Step 4: Verify the user is redirected to the dashboard
  await expect(page).toHaveURL(/\/bank\/dashboard/);
  await expect(dashboardPage.dashboardContainer).toBeVisible();
  await expect(dashboardPage.welcomeMessage).toContainText('Welcome back');

  // Verify the dashboard UI loaded with no blocking error
  await expect(dashboardPage.statCards).toBeVisible();
  await expect(dashboardPage.quickActions).toBeVisible();
  await expect(dashboardPage.recentTransactions).toBeVisible();
  await expect(dashboardPage.logoutButton).toBeVisible();
  // Verify no visible blocking error is present (an empty alert region may
  // legitimately exist in the DOM, so assert visibility rather than count).
  await expect(dashboardPage.errorMessage).toBeHidden();
});
