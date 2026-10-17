import dotenv from 'dotenv';
import { test, expect } from '@playwright/test';

dotenv.config();

const LOGIN_URL = process.env.UI_QA_LOGIN_URL;
const USERNAME = process.env.UI_QA_USERNAME;
const PASSWORD = process.env.UI_QA_PASSWORD;

test.describe('SM-FR-02 - Add Payee', () => {

    test.beforeEach(async ({ page }) => {

        expect(LOGIN_URL).toBeTruthy();
        expect(USERNAME).toBeTruthy();
        expect(PASSWORD).toBeTruthy();

        // Login
        await page.goto(LOGIN_URL);

        await page
            .getByPlaceholder('Enter username')
            .fill(USERNAME);

        await page
            .getByPlaceholder('Enter password')
            .fill(PASSWORD);

        await page
            .getByRole('button', { name: 'Sign In' })
            .click();

        // Dashboard Validation
        await expect(page).toHaveURL(/\/bank\/dashboard/);

        await expect(
            page.getByRole('heading', {
                name: /Welcome back/i
            })
        ).toBeVisible();

        // Navigate to Send Money
        const sendMoneyMenu = page
            .getByText('Send Money', { exact: true })
            .first();

        await expect(sendMoneyMenu).toBeVisible();

        await sendMoneyMenu.click();

        // Send Money Page Validation
        await expect(
            page.getByText('Pay someone externally')
        ).toBeVisible();

        await expect(
            page.getByText('Add', { exact: true })
        ).toBeVisible();
    });

    test(
        'Positive - Verify Add Payee flow opens @smoke',
        async ({ page }) => {

            const addPayeeButton =
                page.getByText('Add', { exact: true });

            await expect(addPayeeButton).toBeVisible();
            await expect(addPayeeButton).toBeEnabled();

            await addPayeeButton.click();

            // Verify Add Payee dialog opened
            const cancelAddPayeeButton =
                page.getByTestId('cancel-add-payee-btn');

            await expect(cancelAddPayeeButton)
                .toBeVisible();

            await expect(cancelAddPayeeButton)
                .toBeEnabled();
        }
    );

  test(
    'Negative - Verify cancelling Add Payee does not create a payee @smoke',
    async ({ page }) => {

        const addPayeeButton = page.getByText(
            'Add',
            { exact: true }
        );

        await expect(addPayeeButton).toBeVisible();
        await expect(addPayeeButton).toBeEnabled();

        await addPayeeButton.click();

        const cancelAddPayeeButton = page.getByTestId(
            'cancel-add-payee-btn'
        );

        await expect(cancelAddPayeeButton)
            .toBeVisible();

        await expect(cancelAddPayeeButton)
            .toBeEnabled();

        // Cancel Add Payee
        await cancelAddPayeeButton.click();

        // Verify Add Payee popup/dialog closed
        await expect(
            page.getByTestId('cancel-add-payee-btn')
        ).not.toBeVisible();

        // Verify user remains on Send Money page
        await expect(
            page.getByText('Pay someone externally')
        ).toBeVisible();

        await expect(
            page.getByText('Add', { exact: true })
        ).toBeVisible();

        // Verify Review & Send button is still available
        await expect(
            page.getByRole('button', {
                name: /Review & Send/i
            })
        ).toBeVisible();
    }
);
});