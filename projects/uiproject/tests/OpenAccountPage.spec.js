// Author : Your Name
// Module : Open New Account
// Requirement ID : ACC-REQ-01

const { test, expect } = require('@playwright/test');
const { OpenAccountPage } = require('../pages/OpenAccountPage');
const appConfig = require('../config/app.config');

test.describe('Open Account Management', () => {

  test('ACC-01 - Open New Account page loads and creates a new Savings account', async ({ page }) => {

    const openAccountPage = new OpenAccountPage(page);
    const parabankConfig = appConfig.getUiConfig('parabank');
    const credentials = appConfig.getUiCredentials('parabank');

    // Navigate to Login Page
    await page.goto(parabankConfig.loginUrl);

    await test.info().attach('Login Page', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    // Login
    await page.locator('input[name="username"]').fill(credentials.username);
    await page.locator('input[name="password"]').fill(credentials.password);

    await page.locator('input[value="Log In"]').click();

    await expect(page).toHaveURL(/overview\.htm/i);

    await test.info().attach('Account Overview', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    // Navigate to Open New Account
    await openAccountPage.openNewAccountPage();

    await test.info().attach('Open New Account Page', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    // Verify Page Elements
    await openAccountPage.verifyPageLoaded();
    await openAccountPage.verifyFormFields();
    await openAccountPage.verifyDropdownValues();

    await test.info().attach('Open Account Form Verified', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    // Create Savings Account
    await openAccountPage.createSavingsAccount();

    await test.info().attach('Account Creation Request', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    // Verify Account Created
    const accountNumber =
      await openAccountPage.verifyNewAccountCreated();

    expect(accountNumber).not.toBe('');

    await test.info().attach('New Account Created', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    // Verify Account Balance
    const balance =
      await openAccountPage.verifyAccountAmount();

    expect(balance).not.toBe('');

    await test.info().attach('Account Balance Verified', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    console.log(`New Account Number: ${accountNumber}`);
    console.log(`Account Balance: ${balance}`);

    // Defensive Validation
    await expect(page.locator('body')).not.toContainText(/error|exception/i);

    await test.info().attach('Final Validation', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });
  });

});