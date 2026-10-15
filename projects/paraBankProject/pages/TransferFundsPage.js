import BasePage from './BasePage.js';
import transferFundsSelectors from '../selectors/transferFundsPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

export class TransferFundsPage extends BasePage {
  constructor(page) {
    super(page);
    this.transferFundsLink = resolveLocator(page, transferFundsSelectors.transferFundsLink);
    this.amountInput = resolveLocator(page, transferFundsSelectors.amountInput);
    this.fromAccountDropdown = resolveLocator(page, transferFundsSelectors.fromAccountDropdown);
    this.toAccountDropdown = resolveLocator(page, transferFundsSelectors.toAccountDropdown);
    this.transferButton = resolveLocator(page, transferFundsSelectors.transferButton);
    this.transferSuccessMessage = resolveLocator(page, transferFundsSelectors.transferSuccessMessage);
    this.transferConfirmationDetails = resolveLocator(page, transferFundsSelectors.transferConfirmationDetails);
    this.errorHeading = resolveLocator(page, transferFundsSelectors.errorHeading);
    this.errorMessage = resolveLocator(page, transferFundsSelectors.errorMessage);
  }

  async openTransferFunds() {
    await this.transferFundsLink.click();
    await this.amountInput.waitFor({ state: 'visible' });
  }

  async selectFromAccount(accountNumber) {
    await this.fromAccountDropdown.selectOption({ label: String(accountNumber) });
  }

  async selectToAccount(accountNumber) {
    await this.toAccountDropdown.selectOption({ label: String(accountNumber) });
  }

  async enterAmount(amount) {
    await this.amountInput.fill(String(amount));
  }

  async clearAmount() {
    await this.amountInput.fill('');
  }

  async clickTransfer() {
    await this.transferButton.click();
  }

  async transferFunds({ amount, fromAccount, toAccount }) {
    await this.selectFromAccount(fromAccount);
    await this.selectToAccount(toAccount);
    await this.enterAmount(amount);
    await this.clickTransfer();
  }

  async getTransferResultText() {
    return (await this.page.locator('#rightPanel').innerText()).trim();
  }

  async getErrorText() {
    return (await this.page.locator('#rightPanel').innerText()).trim();
  }
}

export default TransferFundsPage;