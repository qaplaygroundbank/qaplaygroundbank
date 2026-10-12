import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import DashboardPage from '../pages/DashboardPage.js';
import users from '../../../testdata/users.json' with { type: 'json' };
import {
  createCurrencyFormatter,
  parseCurrencyValue,
  matchesCurrencyFormat
} from '../utils/currency.js';

// Optional, opt-in debug hook (see dashboard.spec.js). Normal timeouts unchanged.
test.afterEach(async ({ page }) => {
  if (process.env.KEEP_BROWSER_OPEN) {
    await page.pause();
  }
});

test('Account balance is displayed with valid currency format', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const appConfig = users.appConfig;
  const formatter = createCurrencyFormatter(appConfig);

  await loginPage.openLoginPage();
  await loginPage.login(users.standardUser.username, users.standardUser.password);

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
  const netWorthValue = dashboardPage.accountSummaryValueByLabel(appConfig.netWorthCardLabel);
  await expect(netWorthValue).toBeVisible();
  const netWorthText = (await netWorthValue.textContent())?.trim() ?? '';
  expect(netWorthText).toBe(users.standardUser.expectedDashboardNetWorth);
});
