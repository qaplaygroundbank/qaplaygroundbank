import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import DashboardPage from '../../pages/DashboardPage.js';
import { URLS, VALIDATIONS } from '../../utils/constants.js';
import dashboardTestData from '../../../../testdata/dashboardTestData.json' with { type: 'json' };
import {
  createCurrencyFormatter,
  parseCurrencyValue,
  matchesCurrencyFormat
} from '../../utils/currency.js';

// Test data (credentials) is read from the shared JSON test-data file.
// Application URLs are read from constants.js.
const credentials = dashboardTestData.loginCredentials;
const formatter = createCurrencyFormatter(dashboardTestData.appConfig);

test.describe('Dashboard', () => {
  let loginPage;
  let dashboardPage;

  // Logout after every test (existing logout flow).
  // Only attempts logout when the dashboard is actually visible so a failed
  // login does not mask the original failure with a logout error.
  test.afterEach(async () => {
    if (dashboardPage && (await dashboardPage.dashboardContainer.isVisible())) {
      await dashboardPage.logout();
    }
  });

  // TC01 - Dashboard loads after valid login
  test('TC01 - Dashboard loads after valid login @smoke', async ({ page }) => {
    // Login process for this test separately.
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.openLoginPage();
    await loginPage.login(credentials.username, credentials.password);

    // Verify successful login redirects the user to the Dashboard.
    await expect(page).toHaveURL(VALIDATIONS.DASHBOARD_URL);

    // Verify the dashboard page container is visible (page loaded without
    // blocking errors).
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Verify no visible blocking error alert is present on the dashboard.
    // (The Next.js route announcer is excluded by the page object locator.)
    await expect(dashboardPage.blockingErrorAlert).toBeHidden();

    // Verify the logged-in user is the same as the user shown on the dashboard
    // sidebar.
    await expect(dashboardPage.sidebarUsername).toHaveText(credentials.username);
    expect(await dashboardPage.getSidebarUsername()).toBe(credentials.username);
  });

  // TC02 - Dashboard shows account summary
  test('TC02 - Dashboard shows account summary @regression', async ({ page }) => {
    // Login process for this test separately.
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.openLoginPage();
    await loginPage.login(credentials.username, credentials.password);

    // Verify the dashboard UI sections are loaded.
    await expect(dashboardPage.statCards).toBeVisible();

    // Verify account summary cards are displayed.
    await expect(dashboardPage.accountSummaryCards).toHaveCount(4);

    // Verify the displayed account information belongs to the logged-in user
    // by confirming the sidebar username matches the user who logged in.
    await expect(dashboardPage.sidebarUsername).toHaveText(credentials.username);

    // Verify no unrelated user data is shown: the sidebar shows the logged-in
    // user's identity only (not another user's data), and is not empty.
    const sidebarUser = await dashboardPage.getSidebarUsername();
    expect(sidebarUser.length).toBeGreaterThan(0);

    // Verify the correct account summary labels are displayed (e.g. Total Net
    // Worth, Net Change, Income, Expenses) in the expected order.
    const expectedLabels = dashboardTestData.standardUser.expectedCardLabelsInOrder;
    const actualLabels = await dashboardPage.getAccountSummaryLabelsInOrder();
    expect(actualLabels).toEqual(expectedLabels);

    // Verify each account summary balance value is populated: non-blank and
    // numeric (not NaN).
    for (const label of expectedLabels) {
      const valueLocator = dashboardPage.accountSummaryValueByLabel(label);
      const value = (await valueLocator.textContent() ?? '').trim();
      expect(value).not.toBe('', `Account summary balance for "${label}" must not be blank`);
      expect(Number.isNaN(parseCurrencyValue(value))).toBe(false, `Account summary balance "${value}" for "${label}" is not numeric`);
    }
  });

  // TC03 - Account balance is displayed with valid currency format
  test('TC03 - Account balance is displayed with valid currency format @regression', async ({
    page
  }) => {
    // Login process for this test separately.
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.openLoginPage();
    await loginPage.login(credentials.username, credentials.password);

    // Verify account summary cards (balances) are populated.
    await expect(dashboardPage.accountSummaryCards).toHaveCount(4);

    const cards = await dashboardPage.accountSummaryCards.all();
    expect(cards.length).toBeGreaterThan(0, 'Expected at least one account summary card');

    for (const card of cards) {
      const valueLocator = dashboardPage.accountSummaryValue(card);
      const displayed = (await valueLocator.textContent() ?? '').trim();

      // Verify the balance is not blank and parses to a numeric value (not NaN).
      expect(displayed).not.toBe('', 'Account balance value must not be blank');
      const numeric = parseCurrencyValue(displayed);
      expect(Number.isNaN(numeric)).toBe(false, `Balance value "${displayed}" is not numeric`);

      // Verify the currency symbol and decimal format match the configured
      // locale/currency (e.g. USD en-US -> "$1,234.56").
      expect(
        matchesCurrencyFormat(displayed, formatter),
        `Balance value "${displayed}" does not match the expected currency format`
      ).toBe(true);

      // Verify the balance is displayed correctly without UI truncation or overlap.
      await expect(valueLocator).toBeVisible();
      expect(
        await dashboardPage.isAccountSummaryValueDisplayedWithoutOverlap(valueLocator)
      ).toBe(true, `Balance value "${displayed}" is truncated or overlapping`);
    }
  });
});

