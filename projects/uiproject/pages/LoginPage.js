import BasePage from './BasePage.js';
import { URLS } from '../utils/constants.js';
import loginPageSelectors from '../selectors/loginPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.usernameInput = resolveLocator(page, loginPageSelectors.usernameInput);
        this.passwordInput = resolveLocator(page, loginPageSelectors.passwordInput);
        this.loginButton = resolveLocator(page, loginPageSelectors.loginButton);
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