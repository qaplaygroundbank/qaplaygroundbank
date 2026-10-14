import dotenv from 'dotenv';
import { test, expect } from '@playwright/test';

dotenv.config();

const LOGIN_URL = process.env.UI_QA_LOGIN_URL;
const USERNAME = process.env.UI_QA_USERNAME;
const PASSWORD = process.env.UI_QA_PASSWORD;

test.describe('SM-FR-02 - Add Payee', () => {

    test.beforeEach(async ({ page }) => {

        // Validate environment variables
        expect(LOGIN_URL, 'UI_QA_LOGIN_URL is missing').toBeTruthy();
        expect(USERNAME, 'UI_QA_USERNAME is missing').toBeTruthy();
        expect(PASSWORD, 'UI_QA_PASSWORD is missing').toBeTruthy();

        // Open login page
        await page.goto(LOGIN_URL);

        // Login with environment credentials
        await page
            .getByPlaceholder('Enter username')
            .fill(USERNAME);

        await page
            .getByPlaceholder('Enter password')
            .fill(PASSWORD);

        await page
            .getByRole('button', { name: 'Sign In' })
            .click();

        // Verify successful login
        await expect(page).toHaveURL(/\/bank\/dashboard/);

        await expect(
            page.getByRole('heading', { name: /Welcome back/i })
        ).toBeVisible();

        // Open Send Money page
        const sendMoneyMenu = page
            .getByText('Send Money', { exact: true })
            .first();

        await expect(sendMoneyMenu).toBeVisible();
        await sendMoneyMenu.click();

        // Verify Send Money page
        await expect(page).toHaveURL(/\/bank\/send-money/);

        await expect(
            page.getByRole('heading', {
                name: 'Send Money',
                exact: true
            })
        ).toBeVisible();

        await expect(
            page.getByText('Pay someone externally', {
                exact: true
            })
        ).toBeVisible();
    });


    test(
        'Positive - Verify Add Payee flow opens',
        async ({ page }) => {

            const addPayeeButton = page
                .getByText('Add', { exact: true });

            await expect(addPayeeButton).toBeVisible();
            await expect(addPayeeButton).toBeEnabled();

            await addPayeeButton.click();

            // Verify Add Payee flow opened
            const addPayeeHeading = page
                .getByText('Add Payee', { exact: true });

            await expect(addPayeeHeading).toBeVisible();
        }
    );


    test(
    'Negative - Verify cancelling Add Payee does not create a payee',
    async ({ page }) => {

        const payeeDropdown = page.getByText(
            'Select a payee',
            { exact: true }
        );

        await expect(payeeDropdown).toBeVisible();

        const addPayeeButton = page.getByText(
            'Add',
            { exact: true }
        );

        await expect(addPayeeButton).toBeVisible();
        await expect(addPayeeButton).toBeEnabled();

        await addPayeeButton.click();

        const addPayeeHeading = page.getByText(
            'Add Payee',
            { exact: true }
        );

        await expect(addPayeeHeading).toBeVisible();

        // Unique locator from the application DOM
        const cancelAddPayeeButton = page.getByTestId(
            'cancel-add-payee-btn'
        );

        await expect(cancelAddPayeeButton).toBeVisible();
        await expect(cancelAddPayeeButton).toBeEnabled();

        await cancelAddPayeeButton.click();

        // Verify Add Payee dialog closed
        await expect(addPayeeHeading).not.toBeVisible();

        // Verify user remains on Send Money page
        await expect(page).toHaveURL(/\/bank\/send-money/);

        await expect(
            page.getByRole('heading', {
                name: 'Send Money',
                exact: true
            })
        ).toBeVisible();

        // Verify payee selection remains unchanged
        await expect(payeeDropdown).toBeVisible();
    }
);
});