import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField = 'input[placeholder="Enter username"]';
  readonly passwordField = 'input[placeholder="Enter password"]';
  readonly loginButton: Locator;
  readonly errorMessage = 'text=The username or password you entered is incorrect.';

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('button', { name: /sign in/i });
  }

  async goto() {
    await this.page.goto('https://qaplayground.com/bank/login');
  }

  async enterUsername(username: string) {
    await this.page.fill(this.usernameField, username);
  }

  async enterPassword(password: string) {
    await this.page.fill(this.passwordField, password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    return this.page.locator(this.errorMessage).textContent() ?? '';
  }
}