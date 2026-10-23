import BasePage from './BasePage.js';
import transactionsPageSelectors from '../selectors/transationsPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

class MoneyTransactionsPage extends BasePage {
    constructor(page) {
        super(page);

        this.transactionsTable = resolveLocator(
            page,
            transactionsPageSelectors.transactionsTable
        );
        this.pagination = resolveLocator(
            page,
            transactionsPageSelectors.pagination
        );

        for (const [name, selector] of Object.entries(transactionsPageSelectors)) {
            switch (name) {
                case 'transactionRows':
                    this[name] = this.transactionsTable.locator('tbody tr');
                    break;
                case 'dateColumnHeader':
                case 'accountColumnHeader':
                case 'descriptionColumnHeader':
                case 'categoryColumnHeader':
                case 'amountColumnHeader':
                    this[name] = this.transactionsTable.getByRole(
                        'columnheader',
                        { name: selector.name, exact: selector.exact }
                    );
                    break;
                case 'paginationStatus':
                    this[name] = this.pagination.locator(selector.value);
                    break;
                case 'previousPageButton':
                case 'nextPageButton':
                case 'downloadCsvButton':
                    this[name] = resolveLocator(
                        this.pagination,
                        selector
                    );
                    break;
                default:
                    this[name] = resolveLocator(page, selector);
            }
        }
    }

    async openFromDashboard() {
        await this.transactionsLink.click();
    }

    async searchByDescription(description) {
        await this.searchInput.fill(description);
    }

    async filterByType(type) {
        const buttons = {
            all: this.allTransactionsButton,
            credits: this.creditsButton,
            debits: this.debitsButton
        };
        const button = buttons[type];

        if (!button) {
            throw new Error(`Unsupported transaction type: "${type}".`);
        }

        await button.click();
    }

    async filterByAccount(account) {
        await this.accountDropdown.click();
        await this.page.getByRole('option', {
            name: account,
            exact: true
        }).click();
    }

    async clearFilters() {
        await this.clearButton.click();
    }

    async getAccountOptions() {
        await this.accountDropdown.click();
        const options = (
            await this.page.getByRole('option').allTextContents()
        ).map((option) => option.trim());
        await this.page.keyboard.press('Escape');
        return options;
    }
}

export default MoneyTransactionsPage;
