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
    // this.memoInput = resolveLocator(page, transferPageSelectors.memoInput);
 
    // Radios & Buttons
    this.transferDateTodayRadio = resolveLocator(page, transferPageSelectors.transferDateTodayRadio);
    this.transferDateScheduleRadio = resolveLocator(page, transferPageSelectors.transferDateScheduleRadio);
    this.reviewTransferButton = resolveLocator(page, transferPageSelectors.reviewTransferButton);
    this.confirmTransferButton = resolveLocator(page, transferPageSelectors.confirmTransferButton);
    this.cancelButton = resolveLocator(page, transferPageSelectors.cancelButton);
 
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
 
    // if (memo) {
    //   await this.memoInput.fill(memo);
    // }
 
    if (dateOption.toLowerCase() === 'schedule') {
      await this.transferDateScheduleRadio.check();
    } else {
      await this.transferDateTodayRadio.check();
    }
  }
   // ─────────────────────────────────────────────────────────────
  // Distinct, dropdown-scoped account selection
  // (added alongside autoSelectAccounts(), which is left unchanged)
  // ─────────────────────────────────────────────────────────────

  /**
   * Opens a dropdown and returns ONLY the options that belong to it.
   * Uses aria-controls when available, else the currently open listbox,
   * instead of a page-wide getByRole('option').
   */
  async getScopedOptions(selectLocator) {
    await selectLocator.click();

    const listId = await selectLocator.getAttribute('aria-controls');
    const list = listId
      ? this.page.locator(`[id="${listId}"]`)
      : this.page.getByRole('listbox').last();

    const options = list.getByRole('option');
    await options.first().waitFor({ state: 'visible' });
    return options;
  }

  /**
   * Selects the first option in the given dropdown whose text differs
   * from `excludeText`, then verifies the dropdown shows that value.
   * @returns {Promise<string>} the selected account text
   */
  

  async selectAccountScoped(selectLocator, excludeText = null) {
  const options = await this.getScopedOptions(selectLocator);
  const optionTexts = (await options.allInnerTexts()).map(text => text.trim());

  const index = optionTexts.findIndex(
    text => text && text !== excludeText
  );

  if (index === -1) {
    await this.page.keyboard.press('Escape');

    throw new Error(
      `No distinct account available. Options: [${optionTexts.join(', ')}]`
    );
  }

  const selectedOption = options.nth(index);
  const selectedText = optionTexts[index];

  // Capture the option's machine-readable value before clicking.
  const expectedValue =
    await selectedOption.getAttribute('data-value') ??
    await selectedOption.getAttribute('value');

  await selectedOption.click();

  /*
   * This custom combobox stores its selected value in the associated
   * hidden textbox. The textbox appears immediately after the combobox
   * in the page snapshot.
   */
  const hiddenInput = selectLocator.locator('xpath=following-sibling::input[1]');

  if (expectedValue) {
    await hiddenInput.waitFor({ state: 'attached' });

    const actualValue = await hiddenInput.inputValue();

    if (actualValue !== expectedValue) {
      throw new Error(
        `Account selection failed. Expected "${expectedValue}", but found "${actualValue}".`
      );
    }
  } else {
    // Fallback: verify that the dropdown no longer has its initial value.
    await this.page.waitForFunction(
      input => Boolean(input?.value?.trim()),
      await hiddenInput.elementHandle()
    );
  }

  return selectedText;
}
  /**
   * Selects different From and To accounts, each scoped to its own dropdown.
   * @returns {Promise<{from: string, to: string}>}
   */
  async autoSelectDistinctAccounts() {
    const from = await this.selectAccountScoped(this.fromAccountSelect);
    const to = await this.selectAccountScoped(this.toAccountSelect, from);

    if (from === to) {
      throw new Error(`From and To accounts must differ, but both are "${from}"`);
    }
    return { from, to };
  }

  /**
   * Same as fillTransferForm(), but uses the distinct-account selection.
   * @param {Object} data - Contains amount and dateOption
   */
  async fillTransferFormWithDistinctAccounts({ amount, dateOption = 'today' }) {
    const accounts = await this.autoSelectDistinctAccounts();

    await this.amountInput.fill(String(amount));

    if (dateOption.toLowerCase() === 'schedule') {
      await this.transferDateScheduleRadio.check();
    } else {
      await this.transferDateTodayRadio.check();
    }
    return accounts;
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