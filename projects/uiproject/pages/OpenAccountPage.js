// Author : Your Name
// Module : Open New Account

const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class OpenAccountPage extends BasePage {
  constructor(page) {
    super(page);

    // Page Elements
    this.accountType = page.locator('#type');
    this.fromAccountId = page.locator('#fromAccountId');
    this.openAccountButton = page.locator(
      'input[value="Open New Account"]'
    );
    this.newAccountId = page.locator('#newAccountId');

    // Confirmation Elements
    this.accountOpenedTitle = page.getByText(
      'Account Opened!',
      { exact: false }
    );

    this.accountNumberLink = page.locator('#newAccountId');
  }

  // Navigate to Open Account Page
  async openNewAccountPage() {
    await this.page.getByRole('link', {
      name: /open new account/i,
    }).click();
  }

  // Validate page loaded successfully
  async verifyPageLoaded() {
    await expect(this.accountType).toBeVisible();
    await expect(this.fromAccountId).toBeVisible();
    await expect(this.openAccountButton).toBeVisible();
  }

  // Validate form controls
  async verifyFormFields() {
    await expect(this.accountType).toBeEnabled();
    await expect(this.fromAccountId).toBeEnabled();
    await expect(this.openAccountButton).toBeEnabled();
  }

  // Verify dropdown values
  async verifyDropdownValues() {
    const accountOptions =
      await this.accountType.locator('option').count();

    expect(accountOptions).toBeGreaterThan(0);

    const fundingAccountOptions = this.fromAccountId.locator('option');
    await expect(fundingAccountOptions).not.toHaveCount(0);

    const fundingAccounts = await fundingAccountOptions.count();
    expect(fundingAccounts).toBeGreaterThan(0);
  }

  // Create Savings Account
  async createSavingsAccount() {
    await expect(this.fromAccountId.locator('option')).not.toHaveCount(0);
    await this.accountType.selectOption('SAVINGS');
    await this.fromAccountId.selectOption({ index: 0 });

    await this.openAccountButton.click();

    await expect(this.accountOpenedTitle).toBeVisible();
    await expect(this.newAccountId).toBeVisible();
  }

  // Verify New Account Created
  async verifyNewAccountCreated() {
    const accountId =
      (await this.newAccountId.textContent()).trim();

    expect(accountId).not.toBe('');

    return accountId;
  }

  // Verify Initial Balance
  async verifyAccountAmount() {
    await this.accountNumberLink.click();

    await expect(
      this.page.getByText('Account Details')
    ).toBeVisible();

    const balanceLocator =
      this.page.locator('#balance');

    await expect(balanceLocator).toBeVisible();
    await expect(balanceLocator).toHaveText(/\S/);

    const balance = (await balanceLocator.innerText()).trim();
    expect(balance).not.toBe('');

    return balance;
  }

  // Complete Validation Flow
  async validateOpenAccountFlow() {
    await this.verifyPageLoaded();
    await this.verifyFormFields();
    await this.verifyDropdownValues();

    await this.createSavingsAccount();

    const accountNumber =
      await this.verifyNewAccountCreated();

    const balance =
      await this.verifyAccountAmount();

    console.log(
      `Account Created: ${accountNumber}, Balance: ${balance}`
    );
  }
}

module.exports = { OpenAccountPage };