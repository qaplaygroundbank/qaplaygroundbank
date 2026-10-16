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

  let loginPage;
  let dashboardPage;
  let credentials;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    credentials = appConfig.getUiCredentials(
      process.env.QA_PLAYGROUND_ENV || 'qa'
    );

    // One-time login for all dashboard tests.
    await loginPage.openLoginPage();
    await loginPage.login(credentials.username, credentials.password);
    await expect(page).toHaveURL(/\/bank\/dashboard/);
    await expect(dashboardPage.dashboardContainer).toBeVisible();
  });

  test('Verify dashboard is displayed after successful authentication', async ({ page }) => {
    await expect(dashboardPage.welcomeMessage).toContainText('Welcome back');
    await expect(dashboardPage.userInfo).toBeVisible();
    // Verify the name shown in the sidebar
    // (<span class="truncate text-xs text-slate-600 ...">standard_user</span>
    // inside `sidebar-user-info`) is the same as the logged-in user.
    // NOTE: `sidebar-user-info` also contains avatar initials ("ST"), so the
    // exact match must target `sidebarUsername`, not the whole container.
    await expect(dashboardPage.sidebarUsername).toHaveText(credentials.username);
    expect(await dashboardPage.getSidebarUsername()).toBe(credentials.username);

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
    const formatter = createCurrencyFormatter(dashboardTestData.appConfig);

    await expect(page).toHaveURL(/\/bank\/dashboard/);
    await expect(dashboardPage.userInfo).toBeVisible();
    // Verify the name shown in the sidebar
    // (<span class="truncate text-xs text-slate-600 ...">standard_user</span>
    // inside `sidebar-user-info`) is the same as the logged-in user.
    // NOTE: `sidebar-user-info` also contains avatar initials ("ST"), so the
    // exact match must target `sidebarUsername`, not the whole container.
    await expect(dashboardPage.sidebarUsername).toHaveText(credentials.username);
    expect(await dashboardPage.getSidebarUsername()).toBe(credentials.username);

    await expect(dashboardPage.statCards).toBeVisible();
    await expect(dashboardPage.accountSummaryCards).toHaveCount(4);

    // Expected account summary cards in dashboard display order.
    const expectedCardLabels = ['Total Net Worth', 'Net Change', 'Income', 'Expenses'];
    const actualCardLabels = [];

    for (const card of await dashboardPage.accountSummaryCards.all()) {
      // Assert card name (label = first <p> in the card).
      const label = dashboardPage.accountSummaryLabel(card);
      await expect(label).toBeVisible();
      const labelText = ((await label.textContent()) ?? '').trim();
      expect(labelText).not.toBe('');
      actualCardLabels.push(labelText);

      // Assert card value (value = second <p> in the card).
      const value = dashboardPage.accountSummaryValue(card);
      await expect(value).toBeVisible();

      const text = (await value.textContent())?.trim() ?? '';
      // Each card shows a numeric amount formatted for the configured currency.
      expect(text).not.toBe('');
      expect(parseCurrencyValue(text)).not.toBeNaN();
      expect(matchesCurrencyFormat(text, formatter)).toBe(true);
    }

    // Verify the cards displayed are exactly the expected cards, in order.
    expect(actualCardLabels).toEqual(expectedCardLabels);
  });

    //Test case-03-account balance is displayed with valid currency format

  test('Account balance is displayed with valid currency format', async ({ page }) => {
    const appConfigData = dashboardTestData.appConfig;
    const formatter = createCurrencyFormatter(appConfigData);


    await expect(page).toHaveURL(/\/bank\/dashboard/);
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

