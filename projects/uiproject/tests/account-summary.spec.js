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

test('Verify account summary/cards are displayed for the logged-in customer', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const username = users.standardUser.username;
  const formatter = createCurrencyFormatter(users.appConfig);

  await loginPage.openLoginPage();
  await loginPage.login(username, users.standardUser.password);

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
    expect(parseCurrencyValue(text)).not.toBeNaN();
    expect(matchesCurrencyFormat(text, formatter)).toBe(true);
  }
});
