//Author : Lalith KUmar 
//Module : Apply Loan

import { expect } from '@playwright/test';
import BasePage from './BasePage.js';


export class LoanPage extends BasePage {
  constructor(page) {
    super(page);

    this.loanHeader = page.locator('div[data-testid="apply-loan-page"]');
    this.dashboardLink = page.locator('[data-testid="sidebar-link-dashboard"]');
    this.pageTitle = page.locator('h1[data-testid="apply-loan-page-title"]');
    this.pageBody = page.locator('body');
    this.amountInput = page.locator('input[name="amount"]');
    this.downPaymentInput = page.locator('input[name="downPayment"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.applyButton = page.getByRole('button', { name: /apply/i });
    // Dialog
    this.loanDialog = page.getByTestId('apply-loan-dialog');
    this.dialogTitle = page.getByTestId('apply-loan-dialog-title');

    // Labels
    this.loanTypeLabel = page.locator('label[for="loan-type-trigger"]');
    this.loanAmountLabel = page.locator('label[for="loan-amount"]');
    this.termLengthLabel = page.locator('label[for="loan-term-trigger"]');
    this.interestRateLabel = page.locator('label[for="loan-interest-rate"]');
    this.accountLabel = page.locator('label[for="loan-account-trigger"]');
    this.purposeLabel = page.getByText('Purpose');

    // Controls
    this.loanTypeDropdown = page.getByTestId('loan-type-select');
    this.loanAmountInput = page.getByTestId('loan-amount-input');
    this.termLengthDropdown = page.getByTestId('loan-term-select');
    this.interestRateInput = page.getByTestId('loan-interest-rate-input');
    this.accountDropdown = page.getByTestId('loan-account-select');
    this.purposeTextarea = page.locator('textarea[name="loan_purpose_field"]');

    // Buttons
    this.reviewBtn = page.getByTestId('review-loan-btn');
    this.cancelBtn = page.getByTestId('cancel-loan-btn');
    this.closeBtn = page.getByRole('button', { name: 'Close' });

    // Open Apply Loan
    this.applyLoanBtn = page.locator('[data-testid="open-apply-loan-btn"]');
  }

  // Open the Apply Loan page from the dashboard navigation
  async openFromDashboard() {
    await this.page.locator('[data-testid="sidebar-link-apply-loan"]').click();
  }

  // Wait until the Apply Loan page has finished loading
  async waitForLoaded() {
    await this.page.waitForLoadState('networkidle');
    await this.loanHeader.waitFor({ state: 'visible' });
  }

  // Click the Apply Loan button to open the form dialog
  async openApplyLoanForm() {
    await expect(this.applyLoanBtn).toBeVisible();
    await expect(this.applyLoanBtn).toBeEnabled();
    await this.applyLoanBtn.click();
    await expect(this.loanDialog).toBeVisible();
  }

  // Validate the dialog title text is correct
  async verifyDialogDisplayed() {
    await expect(this.dialogTitle).toHaveText('Apply for a Loan');
  }

  // Check that all form labels are visible on the dialog
  async verifyLabelsPresent() {
    await expect(this.loanTypeLabel).toBeVisible();
    await expect(this.loanAmountLabel).toBeVisible();
    await expect(this.termLengthLabel).toBeVisible();
    await expect(this.interestRateLabel).toBeVisible();
    await expect(this.accountLabel).toBeVisible();
    await expect(this.purposeLabel).toBeVisible();
  }

  // Validate that the form controls are visible and enabled
  async verifyControlsPresentAndEnabled() {
    const controls = [
      this.loanTypeDropdown,
      this.loanAmountInput,
      this.termLengthDropdown,
      this.interestRateInput,
      this.accountDropdown,
      this.purposeTextarea,
    ];

    for (const control of controls) {
      await expect(control).toBeVisible();
      await expect(control).toBeEnabled();
    }
  }
  // Verify the default prefilled values in the loan form
  async verifyDefaultValues() {
    await expect(this.loanTypeDropdown).toContainText('Select loan type');
    await expect(this.termLengthDropdown).toContainText('36');
    await expect(this.interestRateInput).toHaveValue('5.0');
    await expect(this.accountDropdown).toContainText('Select account');
    await expect(this.loanAmountInput).toHaveAttribute('placeholder', '0.00');
    await expect(this.purposeTextarea).toHaveAttribute('placeholder', 'What will this loan be used for?');
  }

  // Confirm primary action buttons are visible and enabled
  async verifyActionButtons() {
    await expect(this.reviewBtn).toBeVisible();
    await expect(this.reviewBtn).toBeEnabled();
    await expect(this.cancelBtn).toBeVisible();
    await expect(this.cancelBtn).toBeEnabled();
    await expect(this.closeBtn).toBeVisible();
    await expect(this.closeBtn).toBeEnabled();
  }

  // Make sure each form control appears only once in the UI
  async verifyNoDuplicateControls() {
    await expect(this.loanTypeDropdown).toHaveCount(1);
    await expect(this.loanAmountInput).toHaveCount(1);
    await expect(this.termLengthDropdown).toHaveCount(1);
    await expect(this.interestRateInput).toHaveCount(1);
    await expect(this.accountDropdown).toHaveCount(1);
    await expect(this.purposeTextarea).toHaveCount(1);
  }

  // Run the full set of validations for the Apply Loan form
  async validateApplyLoanForm() {
    await this.verifyDialogDisplayed();
    await this.verifyLabelsPresent();
    await this.verifyControlsPresentAndEnabled();
    await this.verifyDefaultValues();
    await this.verifyActionButtons();
    await this.verifyNoDuplicateControls();
  }

}
