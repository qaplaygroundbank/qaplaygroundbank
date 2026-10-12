// pages/AccountPage.js
import { expect } from '@playwright/test';
import BasePage from './BasePage';

class AccountPage extends BasePage{

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);
        this.page = page;

        // ---------- Navigation ----------
        this.accountMenu = page.getByTestId('sidebar-link-accounts');

        // ---------- Page identity ----------
        this.pageHeading = page.getByRole('heading', { name: 'Account' });

        this.errorText = page.getByText(/something went wrong|error/i);

        // ---------- Primary UI elements ----------
        // this.accountSummary = page.getByTestId('account-summary');
        this.accountNumber = page.getByTestId('account-number');
        this.accountBalances = page.getByTestId('account-row-balance');
        this.accountTypeLabel = page.getByTestId('account-type');
        this.transactionsSection = page.getByTestId('account-transactions');
        this.addAccountButton = page.getByRole('button', { name: 'Add Account' });
        this.accountsTable = page.getByTestId('accounts-table');
        this.accountRows = page.getByTestId('account-row');
        this.accountNames = page.getByTestId('account-row-name');
        // ---------- Loading indicator ----------
        
        this.loader = page.getByTestId('loading-spinner');
    }

    // ---------- Actions ----------

    async navigateToAccount() {
        await this.accountMenu.click();
    }

    async waitForAccountLoaded() {
        // Wait for the page to settle, then for the loader to disappear
        await this.page.waitForLoadState('networkidle');
        await expect(this.loader).toBeHidden();
        await expect(this.pageHeading).toBeVisible();
    }

    // ---------- Verifications ----------

    async verifyAccountPage() {
        await expect(this.pageHeading).toBeVisible();
        // await expect(this.errorMessage).toHaveCount(0);
    }

    async verifyVisible() {
        await expect(this.pageHeading).toBeVisible();
        // await expect(this.accountSummary).toBeVisible();
        // await expect(this.accountNumber).toBeVisible();
        // await expect(this.accountBalance).toBeVisible();
        // await expect(this.accountTypeLabel).toBeVisible();
        // await expect(this.transactionsSection).toBeVisible();
        await expect(this.addAccountButton).toBeVisible();
        await expect(this.accountsTable).toBeVisible();

        // Table header columns
        for (const column of ['Account', 'Type', 'Balance', 'Status', 'Actions']) {
            await expect(
                this.accountsTable.getByRole('columnheader', { name: column, exact: true })
            ).toBeVisible();
        }

        // At least one account row, and no blank account name or balance
        expect(await this.accountRows.count()).toBeGreaterThan(0);

        for (const name of await this.accountNames.all()) {
            await expect(name).not.toBeEmpty();
        }

        for (const balance of await this.accountBalances.all()) {
            await expect(balance).toContainText('$');
        }

        await expect(this.errorText).toHaveCount(0);
    }
    

    // ---------- Optional helpers ----------

    async getAccountNumber() {
        return (await this.accountNumber.innerText()).trim();
    }

    async getAccountBalance() {
        return (await this.accountBalance.innerText()).trim();
    }
}

export default AccountPage;