import { expect } from '@playwright/test';
import BasePage from './BasePage.js';
import { accountPageSelectors } from '../selectors/accountsPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

class AccountsPage extends BasePage {
    constructor(page) {
        super(page);

        this.accountMenuLink = resolveLocator(
            page,
            accountPageSelectors.accountMenuLink
        );

        this.accountPageTitle = resolveLocator(
            page,
            accountPageSelectors.accountPageTitle
        );

        this.addAccountButton = resolveLocator(
            page,
            accountPageSelectors.addAccountButton
        );

        this.accountTable = resolveLocator(
            page,
            accountPageSelectors.accountTable
        );

        this.accountRows = resolveLocator(
            page,
            accountPageSelectors.accountRows
        );

        this.activeStatus = resolveLocator(
            page,
            accountPageSelectors.activeStatus
        );

        this.viewButton = resolveLocator(
            page,
            accountPageSelectors.viewButton
        );
    }

    async navigateToAccount() {
        await this.accountMenuLink.click();
    }

    async waitForAccountLoaded() {
        await this.accountPageTitle.waitFor({
            state: 'visible'
        });
    }

    async verifyAccountPage() {
        await expect(this.accountPageTitle).toBeVisible();
    }

    async verifyVisible() {
        await expect(this.accountPageTitle).toBeVisible();
        await expect(this.addAccountButton).toBeVisible();
        await expect(this.accountTable).toBeVisible();
    }

    async clickAddAccount() {
        await this.addAccountButton.click();
    }

    async verifyAccountsExist() {
        await expect(this.accountRows.first()).toBeVisible();
    }

    async verifyStatusVisible() {
        await expect(this.activeStatus.first()).toBeVisible();
    }

    async clickFirstViewAccount() {
        await this.viewButton.first().click();
    }
}

export default AccountsPage;