const { test, expect } = require('@playwright/test');

const testData = {
    applicationUrl: 'https://qaplayground.com/bank/login',
    username: 'standard_user',
    password: 'bank_sauce',
    fromAccount: 'High-Yield Savings — $12,800.00',
    toAccount: 'Everyday Checking — $4,250.00',
    amount: '-240',
    expectedErrorMessage: 'Please enter a valid amount.'
};

// Launch application
async function launchApp(page, url) {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });

    await expect(page).toHaveURL(/.*\/bank\/login/);

    console.log('Application launched successfully');
}

// Login
async function login(page, username, password) {
    await page.getByPlaceholder('Enter username').fill(username);
    await page.getByPlaceholder('Enter password').fill(password);

    await page.getByRole('button', {
        name: 'Sign In'
    }).click();
}

// Verify Dashboard
async function verifyDashboard(page) {
    await expect(page).toHaveURL(/.*dashboard/);

    console.log('User logged in successfully');
}

// Navigate to Transfer Page
async function navigateToTransfer(page) {
    const transferMenu =
        page.getByRole('link', {
            name: /^Transfer$/,
            exact: true
        });

    await expect(transferMenu).toBeVisible();
    await transferMenu.click();
}

// Select Accounts
async function selectAccounts(page, fromAccount, toAccount) {

    // Select From Account
    await page.getByRole('combobox', {
        name: 'From Account'
    }).click();

    await page.getByRole('option', {
        name: fromAccount
    }).click();

    // Select To Account
    await page.getByRole('combobox', {
        name: 'To Account'
    }).click();

    await page.getByRole('option', {
        name: toAccount
    }).click();
}

// Enter Amount
async function enterAmount(page, amount) {
    await page.locator('#transfer-amount').fill(amount);

    console.log(`Amount Entered : ${amount}`);
}

// Click Review Transfer
async function clickReviewTransfer(page) {
    await page.getByRole('button', {
        name: /Review Transfer/i
    }).click();

    console.log('Clicked Review Transfer');
}

// Validate Error Message
async function validateErrorMessage(page, expectedMessage) {

    const errorMessage =
        page.getByText(expectedMessage, {
            exact: true
        });

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(expectedMessage);

    console.log(
        `Validated Error Message : ${expectedMessage}`
    );
}

// Test Case
test('Validate Error Message for Negative Transfer Amount',
    async ({ page }) => {

        await launchApp(
            page,
            testData.applicationUrl
        );

        await login(
            page,
            testData.username,
            testData.password
        );

        await verifyDashboard(page);

        await navigateToTransfer(page);

        await selectAccounts(
            page,
            testData.fromAccount,
            testData.toAccount
        );

        await enterAmount(
            page,
            testData.amount
        );

        await clickReviewTransfer(page);

        await validateErrorMessage(
            page,
            testData.expectedErrorMessage
        );
    });