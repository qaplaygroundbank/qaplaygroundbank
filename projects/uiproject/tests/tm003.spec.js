
import { test, expect } from '@playwright/test'
import LoginPage from '../pages/LoginPage.js'
import bankData from '../data/bankData.json' with { type : 'json'}  


test('TM-003 - Verify From Account is mandatory', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
 
    await loginPage.login(
        bankData.standardUser.username,
        bankData.standardUser.password
    )
    await expect(page).toHaveURL(/.*\/bank\/dashboard/);

    await page.getByTestId('sidebar-link-transfer').click();
    await expect(page).toHaveURL(/.*\/bank\/transfer/);

    const fromAccount = page.getByTestId('transfer-from-select');
    await expect(fromAccount).toContainText('Select account');

    const amount = page.getByTestId('transfer-amount-input');
    await amount.fill('100');

    await page.getByRole('button', { name: 'Review Transfer' }).click();
    await expect(
        page.getByText('Please select a From account.')
    ).toBeVisible();

});