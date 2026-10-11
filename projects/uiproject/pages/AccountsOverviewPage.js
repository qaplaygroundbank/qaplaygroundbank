// pages/AccountsOverviewPage.js
import BasePage from './BasePage.js';
 
class AccountsOverviewPage extends BasePage {
  constructor(page) {
    super(page);
    this.accountTable = page.locator('#accountTable');
    this.accountRows = page.locator('#accountTable tbody tr');
    this.totalCell = page.locator('#accountTable tfoot td').nth(1);
    // Account rows located by the app's data-testid (used by readAccountBalances)
    this.accountRowItems = page.getByTestId('account-row');
  }
 
  async goto() {
    await this.page.goto('overview.htm');
  }
 
  /** Returns [{ accountNumber, balance, available }] parsed from the table. */
  async readAccounts() {
    const rows = await this.accountRows.all();
    const out = [];
    for (const row of rows) {
      const cells = await row.locator('td').allInnerTexts();
      if (cells.length >= 3) {
        out.push({ accountNumber: cells[0].trim(), balance: cells[1].trim(), available: cells[2].trim() });
      }
    }
    return out;
  }
 
  /** Returns [{ name, balance, isOverdrawn }] for each account, read via data-testid. */
  async readAccountBalances() {
    await this.accountRowItems.first().waitFor();
    const out = [];
    for (const row of await this.accountRowItems.all()) {
      out.push({
        name: (await row.getByTestId('account-row-name').innerText()).trim(),
        balance: (await row.getByTestId('account-row-balance').innerText()).trim(),
        isOverdrawn: await row.getByTestId('account-row-overdrawn').isVisible(),
      });
    }
    return out;
  }
 
  async openAccount(accountNumber) {
    await this.page.locator('#accountTable a', { hasText: accountNumber }).click();
  }
}
 
export default AccountsOverviewPage;