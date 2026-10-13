import { test, expect } from '@playwright/test';

test.describe('Accounts Module', () => {
  test('ACC-005 | ACC-FR-02 | Account number/details are displayed correctly', async ({ page }) => {
    const configuredBaseURL = process.env.BASE_URL;
    expect(configuredBaseURL, 'BASE_URL must be configured before navigation.').toBeTruthy();

    await page.goto(`${configuredBaseURL}/index.htm`);

    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('input[value="Log In"]');

    await expect(usernameInput).toBeVisible();
    await usernameInput.fill('john');
    await passwordInput.fill('demo');
    await loginButton.click();

    await expect(page.locator('#leftPanel')).toContainText('Log Out');

    const accountTable = page.locator('#accountTable');
    await expect(accountTable).toBeVisible();

    const accountRows = page.locator('#accountTable tbody tr');
    await expect(accountRows.first()).toBeVisible();

    const rows = await accountRows.all();
    expect(rows.length, 'The authenticated user should have at least one account.').toBeGreaterThan(0);

    const selectedRow = accountRows.first();
    const accountNumber = (await selectedRow.locator('td').nth(0).textContent())?.trim();
    const balance = (await selectedRow.locator('td').nth(1).textContent())?.trim();

    expect(accountNumber, 'Account number should be present in the overview table.').toBeTruthy();
    expect(balance, 'Balance should be present in the overview table.').toBeTruthy();

    await selectedRow.locator('a').click();

    const displayedAccountId = page.locator('#accountId');
    const displayedAccountType = page.locator('#accountType');
    const displayedBalance = page.locator('#balance');

    await expect(displayedAccountId).toBeVisible();
    await expect(displayedAccountType).toBeVisible();
    await expect(displayedBalance).toBeVisible();

    await expect(displayedAccountId).toHaveText(accountNumber);
    expect((await displayedAccountType.textContent())?.trim().toUpperCase()).toMatch(/CHECKING|SAVINGS/);

    const normalizedBalance = (await displayedBalance.textContent())?.replace(/[$,\s]/g, '').trim();
    const expectedBalance = balance?.replace(/[$,\s]/g, '').trim();
    expect(normalizedBalance).toBe(expectedBalance);
  });
});