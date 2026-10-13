import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import BillPayPage from '../pages/BillPayPage.js';

export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    billPayPage: async ({ page }, use) => {
        await use(new BillPayPage(page));
    }
});

export { expect };