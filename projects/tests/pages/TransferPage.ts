import { expect, Page } from '@playwright/test';

export class TransferPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://qaplayground.com/bank/transfer');
  }

  async assertLoaded() {
    await this.page.waitForURL(/\/bank\/transfer$/);
    await this.page.getByRole('heading', { name: 'Transfer Money' }).waitFor({ state: 'visible' });
    await this.page.getByText('Move funds between your accounts').waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: /Review Transfer/i }).waitFor({ state: 'visible' });
  }

  async selectFromAccount(accountName: string) {
    await this.page.getByRole('combobox', { name: 'From Account' }).click();
    await this.page.getByRole('option', { name: new RegExp(accountName, 'i') }).click();
  }

  async selectToAccount(accountName: string) {
    await this.page.getByRole('combobox', { name: 'To Account' }).click();
    await this.page.getByRole('option', { name: new RegExp(accountName, 'i') }).click();
  }

  async setAmount(amount: string) {
    await this.page.getByRole('spinbutton', { name: 'Amount' }).fill(amount);
  }

  async setMemo(memo: string) {
    await this.page.getByPlaceholder('e.g. Rent, vacation fund…').fill(memo);
  }

  async reviewTransfer() {
    await this.page.getByRole('button', { name: /Review Transfer/i }).click();
  }

  async confirmTransfer() {
    await this.page.getByTestId('confirm-transfer-btn').click();
  }

  async completeTransfer(fromAccount: string, toAccount: string, amount: string, memo: string) {
    await this.selectFromAccount(fromAccount);
    await this.selectToAccount(toAccount);
    await this.setAmount(amount);
    await this.setMemo(memo);
    await this.reviewTransfer();

    const summary = this.page.getByTestId('transfer-confirm-summary');
    await expect(this.page.getByTestId('transfer-confirm-title')).toBeVisible();
    await expect(summary).toContainText(fromAccount);
    await expect(summary).toContainText(toAccount);
    await expect(summary).toContainText(`$${amount}.00`);

    await this.confirmTransfer();
    await this.page.waitForURL(/\/bank\/transfer\/confirmation$/);

    await expect(this.page.getByRole('heading', { name: 'Transfer Successful' })).toBeVisible();
    await expect(this.page.getByText('Your funds have been moved.')).toBeVisible();
    await expect(this.page.getByText('Reference Number')).toBeVisible();
    await expect(this.page.getByText('Transfer Details')).toBeVisible();
    await expect(this.page.getByText(fromAccount)).toBeVisible();
    await expect(this.page.getByText(toAccount)).toBeVisible();
    await expect(this.page.getByText(`$${amount}.00`)).toBeVisible();
    await expect(this.page.getByRole('button', { name: /Make Another Transfer/i })).toBeVisible();
  }

  async assertAmountValidationMessage() {
    await this.page.getByRole('button', { name: /Review Transfer/i }).click();
    await expect(this.page.getByText('Please enter a valid amount.')).toBeVisible();
    await expect(this.page).toHaveURL(/\/bank\/transfer$/);
  }
}
