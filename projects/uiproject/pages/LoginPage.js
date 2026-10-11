import BasePage from './BasePage.js';
import { URLS } from '../utils/constants.js';
import selectors from '../selectors/loginPageSelectors.js';

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.usernameInput = page.getByTestId(selectors.usernameInput);
    this.passwordInput = page.getByTestId(selectors.passwordInput);
    this.loginButton = page.getByRole('button', {
      name: 'Sign in to SecureBank'
    });
  }

  async openLoginPage() {
    await this.navigate(URLS.LOGIN_PAGE);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

export default LoginPage;