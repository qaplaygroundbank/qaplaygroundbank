import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';

test(
    'TC01 - Verify To Account is mandatory @regression', 
        async ({ loginPage, page }) => {

        const environment =
            process.env.QA_PLAYGROUND_ENV || 'qa';

        const credentials =
            appConfig.getUiCredentials(environment);

        await loginPage.openLoginPage();

        await loginPage.login(
            credentials.username,
            credentials.password
        );

        // Navigate to Transfer Money
        await page.getByTestId('sidebar-link-transfer').click();

        await expect(page).toHaveURL(/transfer/);

        await expect(
            page.getByRole('heading', {
                name: 'Transfer Money'
            })
        ).toBeVisible();

        // Select From Account
        await page.getByRole('combobox', {
            name: 'From Account'
        }).click();

        await page.getByRole('option', {
            name: /Everyday Checking/i
        }).click();

        // Verify To Account is enabled
        await expect(
            page.getByRole('combobox', {
                name: 'To Account'
            })
        ).toBeEnabled();

        // Leave To Account blank

        // Enter Amount
        await page.getByRole('spinbutton', {
            name: 'Amount'
        }).fill('100');

        // Review Transfer
        await page.getByTestId(
            'review-transfer-btn'
        ).click();

        // Verify validation message
        const errorMessage =
            page.getByTestId(
                'transfer-error-message'
            );

        await expect(errorMessage).toBeVisible();

        await expect(errorMessage)
            .toContainText(
                'Please select a To account.'
            );

        // Verify transfer was NOT submitted
        await expect(page).toHaveURL(/transfer/);

        await expect(
            page.getByRole('heading', {
                name: 'Transfer Money'
            })
        ).toBeVisible();
    }
);