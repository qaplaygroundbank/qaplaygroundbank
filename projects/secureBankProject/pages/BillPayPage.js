import { expect } from '@playwright/test';
import BasePage from './BasePage.js';
import { URLS, VALIDATIONS } from '../utils/constants.js';
import billPaySelectors from '../selectors/billPayPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

class BillPayPage extends BasePage {
  constructor(page) {
    super(page);

    this.billPayMenuLink = resolveLocator(page, billPaySelectors.billPayMenuLink);
    this.fromAccountDropdown = resolveLocator(page, billPaySelectors.fromAccountDropdown);
    this.billerSearchInput = resolveLocator(page, billPaySelectors.billerSearchInput);
    this.billerOption = resolveLocator(page, billPaySelectors.billerOption);
    this.amountInput = resolveLocator(page, billPaySelectors.amountInput);
    this.memoInput = resolveLocator(page, billPaySelectors.memoInput);
    this.reviewPaymentButton = resolveLocator(page, billPaySelectors.reviewPaymentButton);
    this.confirmPaymentButton = resolveLocator(page, billPaySelectors.confirmPaymentButton);
    this.billPayPageTitle = resolveLocator(page, billPaySelectors.billPayPageTitle);
    this.confirmPaymentHeading = resolveLocator(page, billPaySelectors.confirmPaymentHeading);
    this.successHeading = resolveLocator(page, billPaySelectors.successHeading);
    this.referenceNumber = resolveLocator(page, billPaySelectors.referenceNumber);
    this.amountValidationError = page.getByText('Please enter a valid amount.');
    this.amountValidationMessage = resolveLocator(page, billPaySelectors.amountValidationMessage);
    this.closeConfirmPaymentPopup = resolveLocator(page, billPaySelectors.closeConfirmPaymentPopup);
  }

  async navigateToBillPay() {
    await this.billPayMenuLink.click();
  }

  async selectFromAccount(accountName) {
    await this.fromAccountDropdown.click();
    await this.page.getByText(accountName).click();
  }

  async searchBiller(biller) {
    await this.billerSearchInput.fill(biller);
  }

  async selectBiller() {
    await this.billerOption.click();
  }

  async enterAmount(amount) {
    await this.amountInput.fill(amount);
  }

  async enterMemo(memo) {
    await this.memoInput.fill(memo);
  }

  async clickReviewPayment() {
    await this.reviewPaymentButton.click();
  }

  async clickConfirmPayment() {
    await this.confirmPaymentButton.click();
  }

  async verifyBillPayPageLoaded() {
    await expect(this.billPayPageTitle).toBeVisible();
  }

  async verifyConfirmPaymentPopup() {
    await expect(
      this.confirmPaymentHeading
    ).toBeVisible();
  }

  async payBill(billData) {
    await this.selectFromAccount(
      billData.fromAccount
    );
    await this.searchBiller(billData.biller);
    await this.selectBiller();
    await this.enterAmount(billData.amount);
    await this.clickReviewPayment();
    await this.verifyConfirmPaymentPopup();
    await this.clickConfirmPayment();
  }

  async verifyBillPaymentErrorMessage(billData) {
    await this.selectFromAccount(billData.fromAccount);
    await this.searchBiller(billData.biller);
    await this.selectBiller();
    await this.enterAmount(billData.amount);
    await this.clickReviewPayment();

    await expect(this.amountValidationError)
      .toBeVisible();

  
  }

  async verifyBillPaymentSuccess() {

    await expect(this.successHeading)
      .toHaveText('Payment Scheduled');

    await expect(this.referenceNumber)
      .toBeVisible();

    await expect(this.page)
      .toHaveURL(
        VALIDATIONS.BILL_PAY_CONFIRMATION_URL
      );
  }
  
  // Verify zero amount is rejected.
  async verifyZeroAmountValidation() {
    await expect(this.amountValidationMessage).toHaveText('Please enter a valid amount.');
  }
  
  // Verify a valid positive bill amount is accepted.
  async closeConfirmPaymentDialog() {
     await this.closeConfirmPaymentPopup.click();
    }

  async verifyInsufficientBalanceErrorMessage(billData) {
    await this.selectFromAccount(billData.fromAccount);
    await this.searchBiller(billData.biller);
    await this.selectBiller();
    await this.enterAmount(billData.amount);
    await this.clickReviewPayment();
    await this.verifyConfirmPaymentPopup();
    await this.clickConfirmPayment();

    await expect(this.amountValidationMessage)
      .toContainText('Insufficient funds.');
  }

}

export default BillPayPage;
