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
    this.addBillerButton = resolveLocator(page, billPaySelectors.addBillerButton);
    this.addBillerHeading = resolveLocator(page,billPaySelectors.addBillerHeading);
    this.newBillerNameInput = resolveLocator(page,billPaySelectors.newBillerNameInput);
    this.accountReferenceInput = resolveLocator(page,billPaySelectors.accountReferenceInput);
    this.submitAddBillerButton = resolveLocator(page,billPaySelectors.submitAddBillerButton);
    this.paymentDateInput = resolveLocator(page,billPaySelectors.paymentDateInput);
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
  async clickAddBiller() {
    await this.addBillerButton.click();
  }

  async verifyAddBillerPageDisplayed() {
    await expect(this.addBillerHeading)
        .toBeVisible();
  }
  async addNewBiller(billerName, accountNumber) {
    await this.newBillerNameInput.fill(billerName);
    await this.accountReferenceInput.fill(accountNumber);
    await this.submitAddBillerButton.click();
  }
  async verifyBillerAdded(billerName) {
    await expect(this.page.getByText(billerName)).toBeVisible();
  }
  async selectPaymentDate(date) {
    await this.paymentDateInput.click();
    await this.paymentDateInput.fill(date);
  }
  async verifyPaymentDate(date) {
    await expect(this.paymentDateInput).toHaveValue(date);
  }
}

export default BillPayPage;
