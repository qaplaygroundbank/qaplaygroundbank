import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import BillPayPage from '../pages/BillPayPage.js';
import ProfilePage from '../pages/ProfilePage.js';

export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    billPayPage: async ({ page }, use) => {
        await use(new BillPayPage(page));
    },

    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    }

});

export { expect };