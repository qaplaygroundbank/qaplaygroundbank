import BasePage from './BasePage.js';
import { URLS } from '../utils/constants.js';
import  transferPageSelectors  from '../selectors/transferPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';
  class TransferPage extends BasePage {
    constructor(page) {
      super(page);

    
    // Header & Section text
    this.pageHeading = resolveLocator(page, transferPageSelectors.pageHeading);
    this.subHeading = resolveLocator(page, transferPageSelectors.subHeading);
    // Form Fields
    this.fromAccountSelect = resolveLocator(page, transferPageSelectors.fromAccountSelect);
    this.toAccountSelect = resolveLocator(page, transferPageSelectors.toAccountSelect);
    this.amountInput = resolveLocator(page, transferPageSelectors.amountInput);
    this.memoInput = resolveLocator(page, transferPageSelectors.memoInput);
    // Transfer Date Radio Buttons
    this.transferDateTodayRadio = resolveLocator(page, transferPageSelectors.transferDateTodayRadio);
    this.transferDateScheduleRadio = resolveLocator(page, transferPageSelectors.transferDateScheduleRadio);
    // CTA Buttons
    this.reviewTransferButton = resolveLocator(page, transferPageSelectors.reviewTransferButton);
    this.cancelButton = resolveLocator(page, transferPageSelectors.cancelButton);
  }
  async openTransferPage() {
    await this.navigate(URLS.TRANSFER_PAGE || '/bank/transfer');
  }
  async selectFromAccount(account) {
    await this.fromAccountSelect.selectOption(account);
  }
  async selectToAccount(account) {
    await this.toAccountSelect.selectOption(account);
  }
  async enterAmount(amount) {
    await this.amountInput.fill(String(amount));
  }
  async enterMemo(memo) {
    if (memo) {
      await this.memoInput.fill(memo);
    }
  }
  async selectTransferDate(dateOption = 'today') {
    if (dateOption.toLowerCase() === 'schedule') {
      await this.transferDateScheduleRadio.check();
    } else {
      await this.transferDateTodayRadio.check();
    }
  }
  async clickReviewTransfer() {
    await this.reviewTransferButton.click();
  }
  /**
   * Fills and submits transfer details using a JSON data object
   * @param {Object} transferData - Record loaded from data.json
   */
  async fillAndSubmitTransfer(transferData) {
    if (transferData.fromAccount) await this.selectFromAccount(transferData.fromAccount);
    if (transferData.toAccount) await this.selectToAccount(transferData.toAccount);
    if (transferData.amount) await this.enterAmount(transferData.amount);
    if (transferData.memo) await this.enterMemo(transferData.memo);
    if (transferData.dateOption) await this.selectTransferDate(transferData.dateOption);
    await this.clickReviewTransfer();
  }
//  async checkmemoInputVisible() {
//    await expect(this.memoInput).toBeVisible();
//  }
}
export default TransferPage;