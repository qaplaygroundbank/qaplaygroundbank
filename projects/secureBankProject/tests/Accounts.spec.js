import { test, expect } from '../fixtures/baseFixture.js';

test.describe('Account Module Tests', () => {

    test(
        'ACC-001: Verify Account section is accessible after successful login @smoke',
        async ({ page, loginPage }) => {

            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            // Login
            await loginPage.openLoginPage();
            await loginPage.login(username, password);

            // Verify dashboard loaded
            await expect(page).toHaveURL(/\/bank\/dashboard/);

            // Navigate to Account page
            await page.getByTestId('sidebar-link-accounts').click();

            // Verify Account page loaded
            await expect(
                page.getByRole('heading', { name: 'My Accounts' })
            ).toBeVisible();
        }
    );

    test(
        'ACC-002: Verify Account page loads with expected primary UI @smoke',
        async ({ page, loginPage }) => {

            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            // Login
            await loginPage.openLoginPage();
            await loginPage.login(username, password);

            // Verify dashboard loaded
            await expect(page).toHaveURL(/\/bank\/dashboard/);

            // Open Account page
            await page.getByTestId('sidebar-link-accounts').click();

            // Verify page title
            await expect(
                page.getByRole('heading', { name: 'My Accounts' })
            ).toBeVisible();

            // Verify Add Account button
            await expect(
                page.getByRole('button', { name: 'Add Account' })
            ).toBeVisible();

            // Verify account records are displayed
            await expect(
                page.getByText('Everyday Checking').first()
            ).toBeVisible();

            // Verify View button exists
            await expect(
                page.getByText('View').first()
            ).toBeVisible();
        }
    );
});