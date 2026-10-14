import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import DashboardPage from '../pages/DashboardPage.js';
import appConfig from '../config/app.config.js';
import dashboardTestData from '../../../testdata/dashboardTestData.json' with { type: 'json' };
import {
  createCurrencyFormatter,
  parseCurrencyValue,
  matchesCurrencyFormat
} from '../utils/currency.js';

// Optional, opt-in debug hook: when KEEP_BROWSER_OPEN is set the Playwright
// Inspector pauses after the test so you can inspect the page. Normal test
// timeout handling is left unchanged; use `--debug` for full Inspector control.
test.afterEach(async ({ page }) => {
  if (process.env.KEEP_BROWSER_OPEN) {
    await page.pause();
  }
});

test.describe('Dashboard', () => {

  test('Verify dashboard is displayed after successful authentication', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const credentials = appConfig.getUiCredentials(
      process.env.QA_PLAYGROUND_ENV || 'qa'
    );

    // Step 1: Open the login page and check the fields are displayed
    await loginPage.openLoginPage();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();

    // Steps 2 & 3: Enter valid credentials and click Sign In
    await loginPage.login(credentials.username, credentials.password);

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

  test('Verify account summary/cards are displayed for the logged-in customer', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const credentials = appConfig.getUiCredentials(
      process.env.QA_PLAYGROUND_ENV || 'qa'
    );
    const username = credentials.username;
    const formatter = createCurrencyFormatter(dashboardTestData.appConfig);

    await loginPage.openLoginPage();
    await loginPage.login(credentials.username, credentials.password);

    await expect(page).toHaveURL(/\/bank\/dashboard/);
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await expect(dashboardPage.userInfo).toHaveText(
      new RegExp(`^\\S*${username}$`)
    );

    await expect(dashboardPage.statCards).toBeVisible();
    await expect(dashboardPage.accountSummaryCards).toHaveCount(4);
    for (const card of await dashboardPage.accountSummaryCards.all()) {
      const value = dashboardPage.accountSummaryValue(card);
      await expect(value).toBeVisible();

      const text = (await value.textContent())?.trim() ?? '';
      // Each card shows a numeric amount formatted for the configured currency.
      expect(text).not.toBe('');
      expect(parseCurrencyValue(text)).not.toBeNaN();
      expect(matchesCurrencyFormat(text, formatter)).toBe(true);
    }
  });

  test('Account balance is displayed with valid currency format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const credentials = appConfig.getUiCredentials(
      process.env.QA_PLAYGROUND_ENV || 'qa'
    );
    const appConfigData = dashboardTestData.appConfig;
    const formatter = createCurrencyFormatter(appConfigData);

    await loginPage.openLoginPage();
    await loginPage.login(credentials.username, credentials.password);

    await expect(page).toHaveURL(/\/bank\/dashboard/);
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await expect(dashboardPage.accountSummaryCards).toHaveCount(4);

    const cards = await dashboardPage.accountSummaryCards.all();

    for (const card of cards) {
      const value = dashboardPage.accountSummaryValue(card);
      await expect(value).toBeVisible();

      const text = (await value.textContent())?.trim() ?? '';
      // Non-blank, numeric, and correctly formatted for the configured
      // currency/locale. Negative balances are supported.
      expect(text).not.toBe('');
      expect(parseCurrencyValue(text)).not.toBeNaN();
      expect(matchesCurrencyFormat(text, formatter)).toBe(true);
      expect(await dashboardPage.isAccountSummaryValueDisplayedWithoutOverlap(value)).toBe(true);
    }

    // Identify the net-worth card by its label instead of assuming it is the
    // first card in the section.
    const netWorthValue = dashboardPage.accountSummaryValueByLabel(appConfigData.netWorthCardLabel);
    await expect(netWorthValue).toBeVisible();
    const netWorthText = (await netWorthValue.textContent())?.trim() ?? '';
    expect(netWorthText).toBe(dashboardTestData.standardUser.expectedDashboardNetWorth);
  });

});

