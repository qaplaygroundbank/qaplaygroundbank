const { test, expect } = require('@playwright/test');

test('TM-002 - Verify an eligible source account can be selected',
    async ({ page }, testInfo) => {

        // Step 1: Open the banking application
        await page.goto('https://qaplayground.com/bank/login', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        // Step 2: Login with valid credentials
        await page.getByTestId('login-username-input').fill('standard_user');

        await page.getByTestId('login-password-input').fill('bank_sauce');

        await page.getByRole('button', { name: /sign in/i }).click();

        // Step 3: Verify the dashboard
        await expect(page).toHaveURL(/\/bank\/dashboard/, {
            timeout: 30000
        });

        // Step 4: Navigate to Transfer Money
        await page.getByTestId('sidebar-link-transfer').click();

        await expect(page).toHaveURL(/\/bank\/transfer/, {
            timeout: 30000
        });

        console.log('Transfer Money page opened successfully');
        // Step 5: Locate the From Account field
        const fromAccount = page.getByLabel(/from account/i);

        await expect(fromAccount).toBeVisible();

        // Step 6: Open the account selector
        await fromAccount.click();

        // Capture the open selector for debugging
        await page.screenshot({
            path: testInfo.outputPath('TM-002-from-account-options.png'),
            fullPage: true
        });

        // Step 7: Select an eligible source account
        // For a native HTML select:
        const tagName = await fromAccount.evaluate(
            element => element.tagName.toLowerCase()
        );

        let selectedAccount;

        if (tagName === 'select') {
            const options = fromAccount.locator('option');
            const optionCount = await options.count();

            expect(
                optionCount,
                'At least one eligible source account must be available'
            ).toBeGreaterThan(1);

            selectedAccount = (
                await options.nth(1).textContent()
            ).trim();

            await fromAccount.selectOption({ index: 1 });
        } else {
            // For a custom dropdown, select the first available option.
            const options = page.getByRole('option');
            const optionCount = await options.count();

            expect(
                optionCount,
                'No account options found. Inspect the dropdown DOM and update the locator.'
            ).toBeGreaterThan(0);

            const firstOption = options.first();

            selectedAccount = (
                await firstOption.innerText()
            ).trim();

            await firstOption.click();
        }

        // Step 8: Verify that the selected account is displayed
        if (tagName === 'select') {
            await expect(fromAccount).toHaveValue(
                await fromAccount.inputValue()
            );
            expect(await fromAccount.inputValue()).not.toBe('');
        } else {
            await expect(fromAccount).toContainText('acc-checking-1');
        }

        // Capture the final selected-account state
        await page.screenshot({
            path: testInfo.outputPath('TM-002-account-selected.png'),
            fullPage: true
        });

        console.log(
            `TM-002 passed: Selected source account: ${selectedAccount}`
        );
    }
);