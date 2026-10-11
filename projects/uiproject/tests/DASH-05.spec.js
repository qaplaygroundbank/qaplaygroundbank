// tests/DASH-05.spec.js
import { test, expect } from '../fixtures/baseFixture.js';
import users from '../data/bankData.json';
import dashboardData from '../data/dashboardData.json';
import DashboardPage from '../pages/DashboardPage.js';
import AccountsOverviewPage from '../pages/AccountsOverviewPage.js';
 
test('DASH-05: negative/overdrawn balance is handled correctly @dashboard', async ({ page, loginPage }) => {
  const user = users.overdraftUser;
  const accountsPage = new AccountsOverviewPage(page);
  const dashboard = new DashboardPage(page);
 
  // Step 1: log in with an account that permits a negative balance
  await loginPage.openLoginPage();
  await loginPage.login(user.username, user.password);
  await expect(dashboard.dashboardRoot).toBeVisible();
  console.log(`Login successful as ${user.username}`);
  console.log(`Dashboard URL: ${page.url()}`);
 
  // Step 2: locate the overdraft user's expected account on the Accounts page
  await dashboard.accountsLink.click();
  const accounts = await accountsPage.readAccountBalances();
  for (const account of accounts) {
    console.log(`Account: ${account.name} | Balance: ${account.balance}`);
  }
  const overdrawn = accounts.find(a => a.name.includes(dashboardData.overdrawnAccount));
  expect(overdrawn, `${dashboardData.overdrawnAccount} should be listed`).toBeTruthy();
 
  // Step 3: its balance is negative, with the correct sign and currency format
  const value = DashboardPage.toNumber(overdrawn.balance);
  expect(value, `${dashboardData.overdrawnAccount} should have a negative balance`).toBeLessThan(0);
  expect(overdrawn.balance).toBe(DashboardPage.formatCurrency(value, dashboardData.currency));
  expect(overdrawn.isOverdrawn, `${dashboardData.overdrawnAccount} should show Overdrawn`).toBe(true);
  console.log(`Overdrawn account verified: ${overdrawn.name} shows ${overdrawn.balance} with Overdrawn status`);
 
  // Step 4: the negative value is not converted to positive in the dashboard total.
  // Rule under test: Total Net Worth on the dashboard = sum of all balances on the Accounts page.
  // Summed in cents to avoid decimal rounding errors.
  const totalCents = accounts.reduce(
    (sum, a) => sum + Math.round(DashboardPage.toNumber(a.balance) * 100),
    0
  );
  const expectedNetWorth = DashboardPage.formatCurrency(totalCents / 100, dashboardData.currency);
  console.log(`Sum of account balances: ${accounts.map(a => a.balance).join(' + ')} = ${expectedNetWorth}`);
 
  await dashboard.dashboardLink.click();
  const actualNetWorth = await dashboard.getNetWorthText();
  console.log(`Total Net Worth on dashboard: ${actualNetWorth}`);
  expect(actualNetWorth, 'dashboard net worth should equal the sum of account balances').toBe(expectedNetWorth);
 
  // dashboard is still displayed
  await expect(dashboard.dashboardRoot).toBeVisible();
  console.log('DASH-05 PASSED: negative balance is handled correctly on the dashboard');
});