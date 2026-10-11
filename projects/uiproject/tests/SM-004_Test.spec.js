const { test, expect } = require('@playwright/test');

test('Verify each displayed payee can be selected', async ({ page }) => {

    await page.goto('https://qaplayground.com/bank/login');

    await page.locator('input[name="username"]').fill('standard_user');
    await page.locator('input[name="password"]').fill('bank_sauce');

    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.getByTestId('sidebar-link-send-money').click();

    await expect(
        page.getByRole('heading', { name: 'Send Money' })
    ).toBeVisible();

    const payeeDropdown = page.getByRole('combobox', { name: 'Payee' });
    await expect(payeeDropdown).toBeVisible();

    await payeeDropdown.click();

    const payees = page.getByRole('option');
    const payeeCount = await payees.count();

    console.log(`Total Payees Available: ${payeeCount}`);

    await page.keyboard.press('Escape');

    for (let i = 0; i < payeeCount; i++) {

        await payeeDropdown.click();

        await page.getByRole('option').nth(i).click();

        // Expected value: payee-001, payee-002, payee-003...
        const expectedValue = `payee-${String(i + 1).padStart(3, '0')}`;

        await expect(payeeDropdown).toContainText(expectedValue);

        console.log(`Selected and verified: ${expectedValue}`);
    }
});