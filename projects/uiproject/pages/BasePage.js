class BasePage {
  constructor(page) {
    this.page = page;
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
}

export default BasePage;