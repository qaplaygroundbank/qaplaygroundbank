import { expect } from '@playwright/test';
import BasePage from './BasePage.js';
import transferPageSelectors from '../selectors/transferPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

class TransferPage extends BasePage {
    constructor(page) {
        super(page);

        this.transferMenu = resolveLocator(
            page,
            transferPageSelectors.transferMenu
        );

        this.transferHeading = resolveLocator(
            page,
            transferPageSelectors.transferHeading
        );

        this.fromAccountDropdown = resolveLocator(
            page,
            transferPageSelectors.fromAccountDropdown
        );

        this.toAccountDropdown = resolveLocator(
            page,
            transferPageSelectors.toAccountDropdown
        );

        this.amountInput = resolveLocator(
            page,
            transferPageSelectors.amountInput
        );

        this.reviewTransferButton = resolveLocator(
            page,
            transferPageSelectors.reviewTransferButton
        );

        this.errorMessage = resolveLocator(
            page,
            transferPageSelectors.errorMessage
        );
    }

    async openTransferPage() {
        await this.transferMenu.click();

        await expect(this.page).toHaveURL(/transfer/);

        await expect(this.transferHeading).toBeVisible();
    }

    async selectFromAccount() {
        await this.fromAccountDropdown.click();

        await this.page.getByRole('option', {
            name: /Everyday Checking/i
        }).click();
    }

    async verifyToAccountEnabled() {
        await expect(this.toAccountDropdown).toBeEnabled();
    }

    async enterAmount(amount) {
        await this.amountInput.fill(amount);
    }

    async clickReviewTransfer() {
        await this.reviewTransferButton.click();
    }

    async verifyToAccountMandatoryError() {
        await expect(this.errorMessage).toBeVisible();

        await expect(this.errorMessage).toContainText(
            'Please select a To account.'
        );
    }

    async verifyTransferNotSubmitted() {
        await expect(this.page).toHaveURL(/transfer/);

        await expect(this.transferHeading).toBeVisible();
    }
}

export default TransferPage;