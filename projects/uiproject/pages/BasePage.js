// pages/BasePage.js
class BasePage {
  constructor(page) {
    this.page = page;
    this.leftNav = page.locator('#leftPanel');
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async gotoHome() {
    await this.page.goto('index.htm');
  }

  async logout() {
    await this.page.locator('#leftPanel a', { hasText: 'Log Out' }).click();
  }

  navLink(text) {
    return this.leftNav.getByRole('link', { name: text, exact: true });
  }

  errorMessage() {
    return this.page.locator('#rightPanel .error, #rightPanel p.error');
  }

  async isLoggedIn() {
    return (await this.leftNav.getByRole('link', { name: 'Log Out' }).count()) > 0;
  }
}

module.exports = { BasePage };