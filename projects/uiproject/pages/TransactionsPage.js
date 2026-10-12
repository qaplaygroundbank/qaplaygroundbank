import { expect } from '@playwright/test';

// pages/FindTransactionsPage.js
const { BasePage } = require('BasePage');

export class TransactionsPage extends BasePage {
  constructor(page) {
    super(page);
    this.transactionsLink = page.getByTestId('sidebar-link-transactions');
    this.transactionIdInput = page.locator('#transactionId');
    this.dateInput = page.locator('#transactionDate');
    this.fromDateInput = page.locator('#fromDate');
    this.toDateInput = page.locator('#toDate');
    this.amountInput = page.locator('#amount');
    this.resultsTable = page.locator('#transactionTable');
    this.resultsRows = page.locator('#transactionTable tbody tr');
    this.errorText = page.locator('#rightPanel .error, #transactionTable + .error');

    // Page Objects
    this.transactionsPage = page.getByTestId('transactions-page');
    this.pageTitle = page.getByTestId('transactions-page-title');
    this.searchInput = page.getByTestId('all-txn-search-input');
    this.accountDropdown = page.getByTestId('all-txn-account-select');
    this.typeFilter = page.getByTestId('all-txn-type-filter');
    this.transactionsTable = page.getByTestId('all-transactions-table');
    this.transactionRows = page.getByTestId('all-txn-row');

  }

  async goto(accountId) {
    const url = accountId ? `/findtrans.htm?id=${accountId}` : 'findtrans.htm';
    await this.page.goto(url);
  }

  async findByTransactionId(id) {
    await this.transactionIdInput.fill(String(id));
    await this.page.getByRole('button', { name: 'Find Transactions' }).first().click();
  }

  async findByDate(date) {
    await this.dateInput.fill(date);
    await this.page.getByRole('button', { name: 'Find Transactions' }).nth(1).click();
  }

  async findByDateRange(fromDate, toDate) {
    await this.fromDateInput.fill(fromDate);
    await this.toDateInput.fill(toDate);
    await this.page.getByRole('button', { name: 'Find Transactions' }).nth(2).click();
  }

  async findByAmount(amount) {
    await this.amountInput.fill(String(amount));
    await this.page.getByRole('button', { name: 'Find Transactions' }).nth(3).click();
  }

  //click on transaction tab in left side bar
  async navigateToTransactions() {
    await this.transactionsLink.click();
  }

  async navigateToTransactions() {
    await this.transactionsLink.click();
  }

  async verifyTransactionPage() {
    await expect(
      this.page.getByRole('heading', {
        name: /Transactions/i
      })
    ).toBeVisible();
  }

  async waitForTransactionLoaded() {
    await expect(this.transactionsPage).toBeVisible();
    await expect(this.pageTitle).toHaveText('Transactions');
  }

  async verifyVisible() {
    await expect(this.searchInput).toBeVisible();
    await expect(this.accountDropdown).toBeVisible();
    await expect(this.typeFilter).toBeVisible();
    await expect(this.transactionsTable).toBeVisible();

    const rowCount = await this.transactionRows.count();
    expect(rowCount).toBeGreaterThan(0);
  }

}


