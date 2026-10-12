import { expect } from '@playwright/test';

export class loginPage {

    constructor(page) {
        this.page = page;

        // Username field
        this.usernameInput = page.locator('#username');
         // password field
        this.pwdInput = page.locator('#password');
         this.loginButton = page.locator('#Login');
        
    }

    // Method to enter username
    async enterUsername(username) {
        await this.usernameInput.fill(username);
    }

    // Method to enter username
    async enterPassword(pwd) {
        await this.pwdInput.fill(pwd);
    }
     async clickLogin() {
        await this.loginButton.click();
    }

}