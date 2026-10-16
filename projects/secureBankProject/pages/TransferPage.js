import BasePage from './BasePage.js';
import { URLS } from '../utils/constants.js';
import transferPageSelectors from '../selectors/transferPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';
 
class TransferPage extends BasePage {
  constructor(page) {
    super(page);
 
    // Navigation & Headings
    this.navTransfer = resolveLocator(page, transferPageSelectors.navTransfer);
    this.pageHeading = resolveLocator(page, transferPageSelectors.pageHeading);
 
    // Form Controls
    this.fromAccountSelect = resolveLocator(page, transferPageSelectors.fromAccountSelect);
    this.toAccountSelect = resolveLocator(page, transferPageSelectors.toAccountSelect);
    this.amountInput = resolveLocator(page, transferPageSelectors.amountInput);
    this.memoInput = resolveLocator(page, transferPageSelectors.memoInput);
 
    // Radios & Buttons
    this.transferDateTodayRadio = resolveLocator(page, transferPageSelectors.transferDateTodayRadio);
    this.transferDateScheduleRadio = resolveLocator(page, transferPageSelectors.transferDateScheduleRadio);
    this.reviewTransferButton = resolveLocator(page, transferPageSelectors.reviewTransferButton);
    this.confirmTransferButton = resolveLocator(page, transferPageSelectors.confirmTransferButton);
    this.cancelButton = resolveLocator(page, transferPageSelectors.cancelButton);
    this.confirmModalLocator = resolveLocator(page, transferPageSelectors.confirmModal);
    this.confirmModalAmount = resolveLocator(page, transferPageSelectors.confirmModalAmount);
    // Feedback
    this.successMessage = page.getByTestId('transfer-success-heading');

    //Error message
    this.amountErrorMessage = page.getByTestId('transfer-error-message');
  }
 
  /**
   * Navigate to the Transfer page via left navigation menu
   */
  async clickTransferMenu() {
    await this.navTransfer.click();
  }
 
  /**
   * Direct URL navigation fallback
   */
  async openTransferPage() {
    await this.navigate(URLS?.TRANSFER_PAGE || '/bank/transfer');
  }
    //nav Transfer
  async openTransferMoney() {
    await this.navTransfer.click();
  }
 
  /**
   * Automatically selects the first available option for 'From Account'
   * and the second available option for 'To Account'
   */
  async autoSelectAccounts() {
    // 1. Open 'From Account' dropdown and select the first item
    await this.fromAccountSelect.click();
    await this.page.getByRole('option').first().click();
 
    // 2. Open 'To Account' dropdown and select the second item
    await this.toAccountSelect.click();
    const toOptions = this.page.getByRole('option');
    
    // Choose index 1 if 2+ options exist, else choose index 0
    if ((await toOptions.count()) > 1) {
      await toOptions.nth(1).click();
    } else {
      await toOptions.first().click();
    }
  }
 
  /**
   * Fills transfer details with auto-selected accounts
   * @param {Object} data - Contains amount,  and dateOption
   */
  async fillTransferForm({ amount, dateOption = 'today' }) {
    await this.autoSelectAccounts();
 
    await this.amountInput.fill(String(amount));
 
    if (memo) {
      await this.memoInput.fill(memo);
    }
 
    if (dateOption.toLowerCase() === 'schedule') {
      await this.transferDateScheduleRadio.check();
    } else {
      await this.transferDateTodayRadio.check();
    }
  }
  /**
   * Confirm Transfer Modal Dialog
   */
  async confirmModalLoad(timeout = 5000){
    await this.confirmModalLocator.waitFor({state: 'visible', timeout});
  }
  /**
   * Confirm Transfer Amount 
   */
  async getConfirmModalAmountText(){
    if(await this.confirmModalAmount.count()>0){
      return (await this.confirmModalAmount.first().innerText()).trim();
    }
    return '';

  }
 
  /**
   * Click Review Transfer CTA button
   */
  async clickReview() {
    await this.reviewTransferButton.click();
  }
 
  /**
   * Click Confirm Transfer button inside the modal dialog
   */
  async confirmTransfer() {
    await this.confirmTransferButton.click();
  }
}
 
export default TransferPage;