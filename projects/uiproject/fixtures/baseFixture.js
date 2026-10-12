import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import AccountPage from '../pages/AccountPage.js';

export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
     accountPage: async ({ page }, use) => {
        await use(new AccountPage(page));
  },
});

export { expect };