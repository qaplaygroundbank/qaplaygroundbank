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

// The Net Change / Income / Expenses cards are scoped by the application to the
// current calendar month. The seeded transactions belong to June 2026, so the
// browser clock is pinned to a reference date inside that month; otherwise
// those cards legitimately read $0.00 and their expected values would change
// every month. The reference date lives in the shared test data file.
const referenceDate = dashboardTestData.standardUser.referenceDate;

/**
 * Pins the browser clock to the seeded reference date so the month-scoped
 * summary cards always expose the same values. Must be called before the first
 * navigation, because the dashboard computes those cards on load.
 */
async function pinClockToReferenceDate(page) {
  expect(
    referenceDate,
    'standardUser.referenceDate must be set so the month-scoped cards stay deterministic'
  ).toBeTruthy();
  await page.clock.setFixedTime(new Date(referenceDate));
}

/**
 * Asserts that every account summary card displays the expected *number*.
 *
 * The expected numbers are read from the shared test data file
 * (`standardUser.expectedCardValues`, keyed by the card label), so re-seeding
 * the demo data only requires a JSON update. The comparison is done on the
 * parsed number rather than the raw text, so the assertion stays independent
 * of the currency symbol, the grouping separators and the sign placement
 * ("$17,050.00" and "17,050.00" both parse to 17050, and "-$961.47" parses
 * to -961.47).
 *
 * @param {import('../../pages/DashboardPage.js').default} dashboardPage
 * @param {string[]} labels Labels of the cards that must be checked.
 */
async function expectCardValuesToMatchExpected(dashboardPage, labels) {
  const expectedCardValues = dashboardTestData.standardUser.expectedCardValues;

  for (const label of labels) {
    const expectedNumber = expectedCardValues[label];
    expect(
      expectedNumber,
      `No expected value is defined for the stat card "${label}" in the test data`
    ).toBeDefined();

    // Exactly one card must carry the label, otherwise the lookup below could
    // silently read the wrong card.
    const card = dashboardPage.accountSummaryCardByLabel(label);
    await expect(
      card,
      `Expected exactly one account summary card for "${label}"`
    ).toHaveCount(1);

    const displayed = await dashboardPage.getAccountSummaryValueByLabel(label);
    const displayedNumber = parseCurrencyValue(displayed);

    expect(
      Number.isNaN(displayedNumber),
      `Stat card "${label}" displays "${displayed}", which is not a number`
    ).toBe(false);

    expect(
      displayedNumber,
      `Stat card "${label}" displays "${displayed}" (${displayedNumber}), which does not match the expected value ${expectedNumber}`
    ).toBe(expectedNumber);
  }
}

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
  test('TC01 - Dashboard loads after valid login', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
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
  test('TC02 - Dashboard shows account summary', { tag: ['@regression'] }, async ({ page }) => {
    // Login process for this test separately.
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Pin the clock so the month-scoped cards expose the seeded transactions
    // and the expected values below stay valid on any day the suite runs.
    await pinClockToReferenceDate(page);

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

    // Verify each card displays the expected value (not just a populated one),
    // so a wrong amount is caught here as well.
    await expectCardValuesToMatchExpected(dashboardPage, expectedLabels);
  });

  // TC03 - Account balance is displayed with valid currency format
  test('TC03 - Account balance is displayed with valid currency format', { tag: ['@regression'] }, async ({
    page
  }) => {
    // Login process for this test separately.
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Pin the browser clock to the reference date from the shared test data
    // *before* the first navigation, so the month-scoped cards expose the
    // seeded transactions and the expected values stay valid on any day the
    // suite runs.
    await pinClockToReferenceDate(page);

    await loginPage.openLoginPage();
    await loginPage.login(credentials.username, credentials.password);

    // Verify account summary cards (balances) are populated.
    await expect(dashboardPage.accountSummaryCards).toHaveCount(4);

    const cards = await dashboardPage.accountSummaryCards.all();
    expect(cards.length).toBeGreaterThan(0, 'Expected at least one account summary card');

    // Verify the net worth stat card shows the expected balance for the
    // logged-in customer. The expected value is read from the shared test data
    // file (never hard-coded here), so a change to the seeded account balances
    // only needs a JSON update.
    const netWorthLabel = dashboardTestData.appConfig.netWorthCardLabel;
    const netWorthCard = dashboardPage.accountSummaryCardByLabel(netWorthLabel);
    await expect(
      netWorthCard,
      `Expected exactly one account summary card for "${netWorthLabel}"`
    ).toHaveCount(1);

    const expectedNetWorth = dashboardTestData.standardUser.expectedDashboardNetWorth;
    const displayedNetWorth = (
      (await dashboardPage.accountSummaryValue(netWorthCard).textContent()) ?? ''
    ).trim();

    expect(
      displayedNetWorth,
      `Displayed net worth "${displayedNetWorth}" does not match the expected value "${expectedNetWorth}"`
    ).toBe(expectedNetWorth);

    // Verify every stat card displays the expected *number*, not just a
    // correctly formatted string.
    const displayedLabels = await dashboardPage.getAccountSummaryLabelsInOrder();
    expect(displayedLabels.length).toBeGreaterThan(0, 'Expected at least one stat card label');
    await expectCardValuesToMatchExpected(dashboardPage, displayedLabels);

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

