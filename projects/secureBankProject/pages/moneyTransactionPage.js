import BasePage from './BasePage.js';

class MoneyTransactionPage extends BasePage {
    constructor(page) {
        super(page);
        this.transactionsLink = page.getByRole('link', {
            name: /Transactions View all account activity/
        });
        this.heading = page.getByRole('heading', { name: 'Transactions' });
        this.searchInput = page.getByRole('textbox', { name: 'Search' });
        this.accountDropdown = page.getByRole('combobox', { name: 'Account' });
        this.allTransactionsButton = page.getByRole('button', { name: 'All', exact: true });
        this.creditsButton = page.getByRole('button', { name: 'Credits', exact: true });
        this.debitsButton = page.getByRole('button', { name: 'Debits', exact: true });
        this.clearButton = page.getByRole('button', { name: 'Clear', exact: true });
        this.transactionsTable = page.getByRole('table', {
            name: 'All account transactions'
        });
        this.transactionRows = this.transactionsTable.locator('tbody tr');
        this.dateColumnHeader = this.transactionsTable.getByRole('columnheader', {
            name: 'Date'
        });
        this.accountColumnHeader = this.transactionsTable.getByRole('columnheader', {
            name: 'Account'
        });
        this.descriptionColumnHeader = this.transactionsTable.getByRole('columnheader', {
            name: 'Description'
        });
        this.categoryColumnHeader = this.transactionsTable.getByRole('columnheader', {
            name: /Category/
        });
        this.amountColumnHeader = this.transactionsTable.getByRole('columnheader', {
            name: /Amount/
        });
        this.noResultsMessage = page.getByText(
            'No transactions match your filters.',
            { exact: true }
        );
        this.pagination = page.getByRole('navigation', {
            name: 'Transaction pagination'
        });
        this.paginationStatus = this.pagination.locator('p');
        this.previousPageButton = this.pagination.getByRole('button', {
            name: 'Previous page'
        });
        this.nextPageButton = this.pagination.getByRole('button', {
            name: 'Next page'
        });
        this.downloadCsvButton = this.pagination.getByRole('button', {
            name: 'Download CSV'
        });
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

<<<<<<< HEAD
export default MoneyTransactionPage;
=======
export default MoneyTransactionPage;
>>>>>>> baf7503a9121132fd8b29bd1ae5d8d31e52c9f40
