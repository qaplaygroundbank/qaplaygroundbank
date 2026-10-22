import BasePage from './BasePage.js';
import transactionsPageSelectors from '../selectors/transactionsPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

class MoneyTransactionPage extends BasePage {
    constructor(page) {
        super(page);
        this.transactionsLink = resolveLocator(page, transactionsPageSelectors.transactionsLink);
        this.heading = resolveLocator(page, transactionsPageSelectors.heading);
        this.searchInput = resolveLocator(page, transactionsPageSelectors.searchInput);
        this.accountDropdown = resolveLocator(page, transactionsPageSelectors.accountDropdown);
        this.allTransactionsButton = resolveLocator(page, transactionsPageSelectors.allTransactionsButton);
        this.creditsButton = resolveLocator(page, transactionsPageSelectors.creditsButton);
        this.debitsButton = resolveLocator(page, transactionsPageSelectors.debitsButton);
        this.clearButton = resolveLocator(page, transactionsPageSelectors.clearButton);
        this.transactionsTable = resolveLocator(page, transactionsPageSelectors.transactionsTable);
        this.transactionRows = resolveLocator(page, transactionsPageSelectors.transactionRows);
        this.dateColumnHeader = resolveLocator(page, transactionsPageSelectors.dateColumnHeader);
        this.accountColumnHeader = resolveLocator(page, transactionsPageSelectors.accountColumnHeader);
        this.descriptionColumnHeader = resolveLocator(page, transactionsPageSelectors.descriptionColumnHeader);
        this.categoryColumnHeader = resolveLocator(page, transactionsPageSelectors.categoryColumnHeader);
        this.amountColumnHeader = resolveLocator(page, transactionsPageSelectors.amountColumnHeader);
        this.noResultsMessage = resolveLocator(page, transactionsPageSelectors.noResultsMessage);
        this.pagination = resolveLocator(page, transactionsPageSelectors.pagination);
        this.paginationStatus = resolveLocator(page, transactionsPageSelectors.paginationStatus);
        this.previousPageButton = resolveLocator(page, transactionsPageSelectors.previousPageButton);
        this.nextPageButton = resolveLocator(page, transactionsPageSelectors.nextPageButton);
        this.downloadCsvButton = resolveLocator(page, transactionsPageSelectors.downloadCsvButton);
    }

    async openFromDashboard() {
        await this.transactionsLink.click();
    }

    async searchByDescription(description) {
        await this.searchInput.fill(description);
    }

    async filterByAccount(accountName) {
        await this.accountDropdown.click();
        await this.page.getByRole('option', { name: accountName, exact: true }).click();
    }

    async getAccountOptions() {
        await this.accountDropdown.click();
        const options = await this.page.getByRole('option').allTextContents();
        return options.map((option) => option.trim());
    }

    async filterByType(type) {
        const typeButtons = {
            all: this.allTransactionsButton,
            credits: this.creditsButton,
            debits: this.debitsButton
        };
        const button = typeButtons[type.toLowerCase()];

        if (!button) {
            throw new Error(`Unsupported transaction type: ${type}`);
        }

        await button.click();
    }

    async clearFilters() {
        await this.clearButton.click();
    }
}

export default MoneyTransactionPage;
