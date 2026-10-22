import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('DASH-06 Dashboard Transaction History', () => {

    test('Verify recent transaction records are shown on Dashboard', async ({ page }) => {

        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        // Login
        await loginPage.navigateToLoginPage();
        await loginPage.login(
            'testuser',
            'Password123'
        );

        // Step 1
        await page.waitForLoadState('networkidle');

        // Step 2
        await dashboardPage.verifyTransactionSectionVisible();

        // Step 3
        await dashboardPage.verifyTransactionsExist();

        // Step 4
        await dashboardPage.verifyTransactionDetailsPresent();

        // Step 5
        // Validate known data
        // Example:
        // await expect(page.getByText('Salary Credit')).toBeVisible();

        // Step 6
        await dashboardPage.verifyNoUnrelatedCustomerData(
            'Other Customer'
        );

        // Step 7
        await dashboardPage.verifyMultipleTransactionsUsable();

    });

});