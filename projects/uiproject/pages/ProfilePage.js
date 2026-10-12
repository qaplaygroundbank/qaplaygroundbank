import BasePage from './BasePage.js';

export class ProfilePage extends BasePage {
    constructor(page) {
        super(page);
    }

    async goto() {
        await this.page.goto('profile.html');
    }
}
