import BasePage from './BasePage.js';
import { URLS } from '../utils/constants.js';
import loginPageSelectors from '../selectors/loginPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';


class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.userNameTextBox = resolveLocator(page, loginPageSelectors.userNameTextBox);
        this.passwordTextBox = resolveLocator(page, loginPageSelectors.passwordTextBox);
        this.loginButton = resolveLocator(page, loginPageSelectors.loginButton);
    }

    async openLoginPage() {
        await this.navigate(URLS.LOGIN_PAGE);
    }

    async login(username, password) {
        await this.userNameTextBox.fill(username);
        await this.passwordTextBox.fill(password);
        await this.loginButton.click();
    }
}

export default LoginPage;