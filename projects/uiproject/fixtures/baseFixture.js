import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import { TransactionsPage } from '../pages/TransactionsPage.js';


export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },


    transactionsPage: async ({ page }, use) => {
        await use(new TransactionsPage(page));
    }
});



export { expect };