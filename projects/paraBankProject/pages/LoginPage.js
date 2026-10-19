import BasePage from './BasePage.js';
import { getLoginUrl } from '../utils/constants.js';
import loginPageSelectors from '../selectors/loginPageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

class LoginPage extends BasePage {

    constructor(page) {
        super(page);
        this.usernameInput = resolveLocator(page,loginPageSelectors.usernameInput);
        this.passwordInput = resolveLocator(page,loginPageSelectors.passwordInput);
        this.loginButton = resolveLocator(page,loginPageSelectors.loginButton);
        this.welcomeMessage = resolveLocator(page,loginPageSelectors.welcomeMessage);
        this.logoutLink = resolveLocator(page,loginPageSelectors.logoutLink);
    }

    async openLoginPage() {
        const loginUrl = getLoginUrl();
        await this.navigate(loginUrl);
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    getWelcomeMessage() {
        return this.welcomeMessage;
    }

    getLogoutLink() {
        return this.logoutLink;
    }
}

export default LoginPage;