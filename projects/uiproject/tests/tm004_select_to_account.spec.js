import { test, expect } from '@playwright/test'
import LoginPage from '../pages/LoginPage.js'
import bankData from '../data/bankData.json' with { type : 'json'}  
test('TM-004 - Verify To Account can be selected', async ({ page }) => {
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
    await fromAccount.click();
    const fromAccountOption  = page.getByRole('option', { name: /Everyday Checking/i });
    await expect(fromAccountOption).toBeVisible();
    await fromAccountOption.click();
    const toAccount = page.getByTestId('transfer-to-select');
    await expect(toAccount).toBeEnabled();
    await toAccount.click();
    const toAccountOption = page.getByRole('option', { name : /High-Yield Savings/i });
    await expect(toAccountOption).toBeVisible();
    await toAccountOption.click();
    await expect(toAccount.locator('[data-slot="select-value"]')).not.toHaveText('Select Account');
});