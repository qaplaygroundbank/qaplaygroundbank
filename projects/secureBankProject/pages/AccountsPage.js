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
        // added here by  vivek 
        this.accountBalance = resolveLocator(
            page,
        accountPageSelectors.accountBalance
        );
        this.checkingAccount = resolveLocator(
            page,
            accountPageSelectors.checkingAccount
        );

        this.savingsAccount = resolveLocator(
            page,
            accountPageSelectors.savingsAccount
        );
        // end here 
       
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
        //added by vivek
        await expect(this.accountRows.first()).toBeVisible();
        //end here
    }
    // added by vivek
    async verifyAccountDetails() {
    await expect(this.checkingAccount).toBeVisible();
    await expect(this.savingsAccount).toBeVisible();
    }
    
    // end here

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
   async getAccountRowsCount() {
    return await this.accountRows.count();
}

async getAccountDetails() {
    return await this.accountRows.allTextContents();
}
}

export default AccountsPage;