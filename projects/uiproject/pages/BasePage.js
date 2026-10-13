import { resolveLocator } from '../utils/locatorResolver.js';
import commonSelectors from '../selectors/commonSelectors.js';

class BasePage {
  constructor(page) {
    this.page = page;
    this.logoutButton = resolveLocator(page, commonSelectors.logoutButton)
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async gotoHome() {
    await this.page.goto('index.htm');
  }

  async logout() {
    await this.logoutButton.click();
  }
}

export default BasePage;