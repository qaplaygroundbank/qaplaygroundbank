import { expect } from '@playwright/test';

export class DashboardPage {
    constructor(page) {
        this.page = page;

        // Update these locators after inspecting the page
        this.transactionSection = page.locator('[data-testid="transaction-history"]');

        this.transactionRows = page.locator(
            '.transaction-row, tbody tr'
        );

        this.transactionDate = page.locator('.transaction-date');
        this.transactionDescription = page.locator('.transaction-description');
        this.transactionAmount = page.locator('.transaction-amount');
    }

    async verifyTransactionSectionVisible() {
        await expect(this.transactionSection).toBeVisible();
    }

    async verifyTransactionsExist() {
        const count = await this.transactionRows.count();
        expect(count).toBeGreaterThan(0);
        console.log(`Transactions Found: ${count}`);
    }

    async verifyTransactionDetailsPresent() {
        const count = await this.transactionRows.count();

        for (let i = 0; i < count; i++) {
            const row = this.transactionRows.nth(i);

            await expect(row).toBeVisible();

            console.log(
                await row.textContent()
            );
        }
    }

    async verifyNoUnrelatedCustomerData(customerName) {
        await expect(
            this.page.getByText(customerName)
        ).toHaveCount(0);
    }

    async verifyMultipleTransactionsUsable() {
        const count = await this.transactionRows.count();

        if (count > 5) {
            await this.transactionRows.last().scrollIntoViewIfNeeded();
            await expect(this.transactionRows.last()).toBeVisible();
        }
    }
}