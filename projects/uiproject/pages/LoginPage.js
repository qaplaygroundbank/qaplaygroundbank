class LoginPage {

    constructor(page) {
        this.page = page;

        // Locators
        this.usernameField = page.locator("//input[@id='login-username']");
        this.passwordField = page.locator("//input[@id='login-password']");
        this.loginButton = page.locator("//button[@type='submit']");
    }

    async navigateToLoginPage() {
        await this.page.goto('https://qaplayground.com/bank/login');
    }

    async login(username, password) {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }
}

module.exports = { LoginPage };