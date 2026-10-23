import { readFile } from 'node:fs/promises';
import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import { VALIDATIONS } from '../../utils/constants.js';
import MoneyTransactionPage from '../../pages/moneyTransactionPage.js';


async function openTransactions(page) {
    const transactionsPage = new MoneyTransactionPage(page);
    await transactionsPage.openFromDashboard();
    await expect(transactionsPage.heading).toBeVisible();
    return transactionsPage;
}

test.describe('Money Transactions', () => {
    test.beforeEach(async ({ page, loginPage }) => {
        const environment = process.env.QA_PLAYGROUND_ENV || 'qa';
        const credentials = appConfig.getUiCredentials(environment);

        await loginPage.openLoginPage();
        await loginPage.login(credentials.username, credentials.password);
        await expect(page).toHaveURL(VALIDATIONS.DASHBOARD_URL, {
            timeout: 30000
        });
    });

    test('Positive 1 - display all transaction fields and filters', async ({ page }) => {
        const transactionsPage = await openTransactions(page);

        await expect(transactionsPage.searchInput).toBeVisible();
        await expect(transactionsPage.accountDropdown).toBeVisible();
        await expect(transactionsPage.allTransactionsButton).toBeVisible();
        await expect(transactionsPage.creditsButton).toBeVisible();
        await expect(transactionsPage.debitsButton).toBeVisible();
        await expect(transactionsPage.dateColumnHeader).toBeVisible();
        await expect(transactionsPage.accountColumnHeader).toBeVisible();
        await expect(transactionsPage.descriptionColumnHeader).toBeVisible();
        await expect(transactionsPage.categoryColumnHeader).toBeVisible();
        await expect(transactionsPage.amountColumnHeader).toBeVisible();

        const firstRowCells = transactionsPage.transactionRows.first().locator('td');
        await expect(firstRowCells).toHaveCount(5);
        for (let index = 0; index < 5; index++) {
            await expect(firstRowCells.nth(index)).not.toBeEmpty();
        }
    });

    test('Positive 2 - search transactions by description', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.searchByDescription('Whole Foods');

        await expect(transactionsPage.transactionRows).toHaveCount(1);
        await expect(transactionsPage.transactionRows.first()).toContainText(
            'Whole Foods Market'
        );
    });

    test('Positive 3 - filter transactions to credits', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.filterByType('credits');

        const rowCount = await transactionsPage.transactionRows.count();
        expect(rowCount).toBeGreaterThan(0);
        for (let index = 0; index < rowCount; index++) {
            await expect(
                transactionsPage.transactionRows.nth(index).locator('td').last()
            ).toHaveText(/^\+\$/);
        }
    });

    test('Positive 4 - filter transactions to debits', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.filterByType('debits');

        const rowCount = await transactionsPage.transactionRows.count();
        expect(rowCount).toBeGreaterThan(0);
        for (let index = 0; index < rowCount; index++) {
            await expect(
                transactionsPage.transactionRows.nth(index).locator('td').last()
            ).toHaveText(/^-\$/);
        }
    });

    test('Positive 5 - filter transactions by account', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.filterByAccount('Everyday Checking');

        const rowCount = await transactionsPage.transactionRows.count();
        expect(rowCount).toBeGreaterThan(0);
        for (let index = 0; index < rowCount; index++) {
            await expect(
                transactionsPage.transactionRows.nth(index).locator('td').nth(1)
            ).toHaveText('Everyday Checking');
        }
    });

    test('Positive 6 - combine transaction filters and clear them', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.filterByAccount('Everyday Checking');
        await transactionsPage.filterByType('debits');
        await transactionsPage.searchByDescription('Whole Foods');

        await expect(transactionsPage.transactionRows).toHaveCount(1);
        await expect(transactionsPage.transactionRows.first()).toContainText(
            'Whole Foods Market'
        );

        await transactionsPage.clearFilters();

        await expect(transactionsPage.searchInput).toHaveValue('');
        await expect(transactionsPage.transactionRows).toHaveCount(10);
        await expect(transactionsPage.paginationStatus).toHaveText(
            'Showing 1–10 of 18'
        );
    });

    test('Positive 7 - validate all account dropdown options', async ({ page }) => {
        const transactionsPage = await openTransactions(page);

        const accountOptions = await transactionsPage.getAccountOptions();
        const expectedOptions = [
            'All accounts',
            'Everyday Checking',
            'High-Yield Savings'
        ];

        expect(accountOptions).toEqual(expectedOptions);
    });

    test('Negative 1 - show empty state when search has no matches', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        const searchText = 'xyz';
        await transactionsPage.searchByDescription(searchText);

        await expect(transactionsPage.noResultsMessage).toBeVisible();
        await expect(transactionsPage.noResultsMessage).toHaveText(
            'No transactions match your filters.'
        );
        await expect(transactionsPage.paginationStatus).toHaveText('No transactions');
        await expect(transactionsPage.previousPageButton).toBeDisabled();
        await expect(transactionsPage.nextPageButton).toBeDisabled();
    });

    test('Negative 2 - return no rows when account and description do not match', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.filterByAccount('High-Yield Savings');
        await transactionsPage.searchByDescription('Whole Foods');

        await expect(transactionsPage.noResultsMessage).toBeVisible();
        await expect(transactionsPage.paginationStatus).toHaveText('No transactions');
    });

    test('Negative 3 - return no rows when a credit is filtered as a debit', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.searchByDescription('Direct Deposit');
        await transactionsPage.filterByType('debits');

        await expect(transactionsPage.noResultsMessage).toBeVisible();
        await expect(transactionsPage.paginationStatus).toHaveText('No transactions');
    });

    test('Negative 4 - handle punctuation-only search with no matches', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.searchByDescription('!@#$%^&*');

        await expect(transactionsPage.noResultsMessage).toBeVisible();
        await expect(transactionsPage.paginationStatus).toHaveText('No transactions');
    });

    test('Boundary 1 - empty search shows all transactions from the first page', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.searchByDescription('');

        await expect(transactionsPage.transactionRows).toHaveCount(10);
        await expect(transactionsPage.paginationStatus).toHaveText(
            'Showing 1–10 of 18'
        );
        await expect(transactionsPage.previousPageButton).toBeDisabled();
        await expect(transactionsPage.nextPageButton).toBeEnabled();
    });

    test('Boundary 2 - a single matching transaction is displayed', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.searchByDescription('Uber');

        await expect(transactionsPage.transactionRows).toHaveCount(1);
        await expect(transactionsPage.transactionRows.first()).toContainText('Uber');
        await expect(transactionsPage.paginationStatus).toHaveText(
            'Showing 1–1 of 1'
        );
    });

    test('Boundary 3 - first page disables previous and enables next', async ({ page }) => {
        const transactionsPage = await openTransactions(page);

        await expect(transactionsPage.paginationStatus).toHaveText(
            'Showing 1–10 of 18'
        );
        await expect(transactionsPage.previousPageButton).toBeDisabled();
        await expect(transactionsPage.nextPageButton).toBeEnabled();
    });

    test('Boundary 4 - last page shows remaining rows and disables next', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.nextPageButton.click();

        await expect(transactionsPage.transactionRows).toHaveCount(8);
        await expect(transactionsPage.paginationStatus).toHaveText(
            'Showing 11–18 of 18'
        );
        await expect(transactionsPage.previousPageButton).toBeEnabled();
        await expect(transactionsPage.nextPageButton).toBeDisabled();
    });

    test('Boundary 5 - navigate from last page back to the first page', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        await transactionsPage.nextPageButton.click();
        await expect(transactionsPage.paginationStatus).toHaveText(
            'Showing 11–18 of 18'
        );

        await transactionsPage.previousPageButton.click();

        await expect(transactionsPage.transactionRows).toHaveCount(10);
        await expect(transactionsPage.paginationStatus).toHaveText(
            'Showing 1–10 of 18'
        );
        await expect(transactionsPage.previousPageButton).toBeDisabled();
        await expect(transactionsPage.nextPageButton).toBeEnabled();
    });

    test('Additional - download the transactions as a CSV file', async ({ page }) => {
        const transactionsPage = await openTransactions(page);
        const downloadPromise = page.waitForEvent('download');
        await transactionsPage.downloadCsvButton.click();
        const download = await downloadPromise;
        const downloadedFile = await download.path();

        expect(download.suggestedFilename()).toMatch(/\.csv$/i);
        expect(downloadedFile).toBeTruthy();
        const csvContents = await readFile(downloadedFile, 'utf8');
        expect(csvContents.length).toBeGreaterThan(0);
    });
});