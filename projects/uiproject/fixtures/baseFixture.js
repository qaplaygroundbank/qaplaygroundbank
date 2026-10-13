import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import BillPayPage from '../pages/BillPayPage.js';
import DashboardPage from '../pages/DashboardPage.js';
import AccountsOverviewPage from '../pages/AccountsOverviewPage.js';

export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    billPayPage: async ({ page }, use) => {
        await use(new BillPayPage(page));
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },

    accountsOverviewPage: async ({ page }, use) => {
        await use(new AccountsOverviewPage(page));
    }
});

export { expect };