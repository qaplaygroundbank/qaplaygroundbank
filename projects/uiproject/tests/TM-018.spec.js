import { test, expect } from '../fixtures/baseFixture.js';
import bankData from '../data/bankData.json' with { type: 'json' };

test.describe('Secure Bank Transfer Tests', () => {
    test('TM-018 - Verify successful transfer confirmation', async ({ page, loginPage }) => {

        await loginPage.openLoginPage();
        await loginPage.login(
            bankData.standardUser.username,
            bankData.standardUser.password
        );

        await expect(page).toHaveURL(/dashboard/);

        await page.getByTestId('sidebar-link-transfer').click();
        await expect(page).toHaveURL(/\/transfer$/);

        const fromAccountTrigger = page.getByTestId('transfer-from-select');
        const toAccountTrigger = page.getByTestId('transfer-to-select');

        await fromAccountTrigger.click();
        await page.getByRole('option', { name: /Everyday Checking/ }).click();
        await expect(toAccountTrigger).toBeEnabled();

        await toAccountTrigger.click();
        await page.getByRole('option', { name: /High-Yield Savings/ }).click();

        const amountInput = page.getByRole('spinbutton', { name: 'Amount' });
        await amountInput.fill('100');
        await expect(amountInput).toHaveValue('100');

        await page.getByRole('button', { name: 'Review Transfer' }).click();
        const transferConfirmationDialog = page.getByRole('dialog', { name: 'Confirm Transfer' });
        await expect(transferConfirmationDialog).toBeVisible();

        await expect(transferConfirmationDialog.getByText('Everyday Checking', { exact: false })).toBeVisible();
        await expect(transferConfirmationDialog.getByText('High-Yield Savings', { exact: false })).toBeVisible();
        await expect(transferConfirmationDialog.getByText('$100.00', { exact: false })).toBeVisible();

        const confirmTransferButton = transferConfirmationDialog.getByRole('button', { name: 'Confirm Transfer' });
        await expect(confirmTransferButton).toBeVisible();
        await confirmTransferButton.click();

        await expect(
            page.getByRole('heading', {
                name: /Transfer (?:Successful|Complete|Confirmed)|Transfer confirmation/i
            })
        ).toBeVisible();

        await expect(page.getByText('Reference Number', { exact: true })).toBeVisible();
        await expect(page.getByText(/^TXN-\d{8}-\d+$/)).toBeVisible();
    });
});
