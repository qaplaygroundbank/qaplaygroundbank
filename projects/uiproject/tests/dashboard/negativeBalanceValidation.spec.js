// tests/dashboard/negativeBalanceValidation.spec.js
import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import { VALIDATIONS } from '../../utils/constants.js';
import dashboardData from '../../testData/dashboardData.json' with { type: 'json' };
import DashboardPage from '../../pages/DashboardPage.js';
 
test.describe('Dashboard', () => {
 
    test('DASH-05: negative/overdrawn balance is handled correctly @dashboard', async ({ page, loginPage, dashboardPage, accountsOverviewPage }) => {
        const environment = process.env.QA_PLAYGROUND_ENV || 'qa';
        const credentials = appConfig.getUiCredentials(environment);
 
        // Step 1: log in with the overdraft user and verify the dashboard loads
        await loginPage.openLoginPage();
        await loginPage.login(dashboardData.overdraftUsername, credentials.password);
        await expect(page).toHaveURL(VALIDATIONS.DASHBOARD_URL);
        await expect(dashboardPage.dashboardRoot).toBeVisible();
 
        // Step 2: verify the expected overdrawn account is listed on the Accounts page
        await dashboardPage.openAccounts();
        const accounts = await accountsOverviewPage.readAccountBalances();
        const overdrawn = accounts.find(a => a.name.includes(dashboardData.overdrawnAccount));
        expect(overdrawn, `${dashboardData.overdrawnAccount} should be listed`).toBeDefined();
 
        // Step 3: verify the balance is negative, correctly formatted and marked Overdrawn
        const value = DashboardPage.toNumber(overdrawn.balance);
        expect(value, `${dashboardData.overdrawnAccount} should have a negative balance`).toBeLessThan(0);
        expect(overdrawn.balance).toBe(DashboardPage.formatCurrency(value, dashboardData.currency));
        expect(overdrawn.isOverdrawn, `${dashboardData.overdrawnAccount} should show Overdrawn`).toBe(true);
 
        // Step 4: verify Total Net Worth equals the sum of all account balances
        // (summed in cents to avoid decimal rounding errors)
        const totalCents = accounts.reduce(
            (sum, a) => sum + Math.round(DashboardPage.toNumber(a.balance) * 100),
            0
        );
        await dashboardPage.openDashboard();
        expect(
            await dashboardPage.getNetWorthText(),
            'Total Net Worth should equal the sum of account balances'
        ).toBe(DashboardPage.formatCurrency(totalCents / 100, dashboardData.currency));
 
        // Verify the dashboard is still displayed
        await expect(dashboardPage.dashboardRoot).toBeVisible();
    });
 
});