import { expect } from '@playwright/test';
import BasePage from './BasePage.js';
import applyLoanSelectors from '../selectors/applyLoanSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';
import applyLoanData from '../testData/applyLoanData.json' with { type: 'json' };
import { waitForPageLoaded } from '../utils/commonTestUtils.js';

class ApplyLoanPage extends BasePage {
    constructor(page) {
        super(page);

        for (const [name, selector] of Object.entries(applyLoanSelectors)) {
            this[name] = resolveLocator(page, selector);
        }
    }

    async openFromDashboard() {
        await this.applyLoanNavigationLink.click();
    }

    async waitForLoaded() {
        await waitForPageLoaded(this.page, this.loanHeader);
    }

    async openApplyLoanForm() {
        await expect(this.openApplyLoanBtn).toBeVisible();
        await expect(this.openApplyLoanBtn).toBeEnabled();
        await this.openApplyLoanBtn.click();
        await expect(this.loanDialog).toBeVisible();
    }

    async verifyDialogDisplayed() {
        await expect(this.dialogTitle).toHaveText(applyLoanData.dialogTitle);
    }

    async verifyLabelsPresent() {
        await expect(this.loanTypeLabel).toBeVisible();
        await expect(this.loanAmountLabel).toBeVisible();
        await expect(this.termLengthLabel).toBeVisible();
        await expect(this.interestRateLabel).toBeVisible();
        await expect(this.accountLabel).toBeVisible();
        await expect(this.purposeLabel).toBeVisible();
    }

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

    async verifyDefaultValues() {
        await expect(this.loanTypeDropdown).toContainText(applyLoanData.defaultLoanTypeText);
        await expect(this.termLengthDropdown).toContainText(applyLoanData.defaultTermLengthText);
        await expect(this.interestRateInput).toHaveValue(applyLoanData.defaultInterestRate);
        await expect(this.accountDropdown).toContainText(applyLoanData.defaultAccountText);
        await expect(this.loanAmountInput).toHaveAttribute('placeholder', applyLoanData.loanAmountPlaceholder);
        await expect(this.purposeTextarea).toHaveAttribute('placeholder', applyLoanData.purposePlaceholder);
    }

    async verifyActionButtons() {
        await expect(this.reviewBtn).toBeVisible();
        await expect(this.reviewBtn).toBeEnabled();
        await expect(this.cancelBtn).toBeVisible();
        await expect(this.cancelBtn).toBeEnabled();
        await expect(this.closeBtn).toBeVisible();
        await expect(this.closeBtn).toBeEnabled();
    }

    async verifyNoDuplicateControls() {
        const controlNamePattern = /^(loanTypeDropdown|loanAmountInput|termLengthDropdown|interestRateInput|accountDropdown|purposeTextarea)$/;

        for (const [name, control] of Object.entries(this)) {
            if (controlNamePattern.test(name)) {
                await expect(control).toHaveCount(1);
            }
        }
    }

    async validateApplyLoanForm() {
        await this.verifyDialogDisplayed();
        await this.verifyLabelsPresent();
        await this.verifyControlsPresentAndEnabled();
        await this.verifyDefaultValues();
        await this.verifyActionButtons();
        await this.verifyNoDuplicateControls();
    }
}

export default ApplyLoanPage;