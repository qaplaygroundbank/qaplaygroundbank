import { expect } from '@playwright/test';
import profilePageSelectors from '../selectors/Profile/profilePageSelectors.js';

class ProfilePage {
    constructor(page) {
        this.page = page;
    }

    async navigateToProfile() {
        await this.page
            .getByTestId(profilePageSelectors.profileLink.value)
            .click();
    }

    async verifyPersonalInfoSection() {
        await expect(
            this.page.getByTestId(profilePageSelectors.personalInfoSection.value)
        ).toBeVisible();
    }

    async verifyEditProfileButton() {
        await expect(
            this.page.getByTestId(profilePageSelectors.editProfileButton.value)
        ).toBeVisible();

        await expect(
            this.page.getByTestId(profilePageSelectors.editProfileButton.value)
        ).toBeEnabled();
    }

    async verifyEmail(email) {
        await expect(
            this.page.getByTestId(profilePageSelectors.email.value)
        ).toHaveText(email);
    }

    async verifyInvalidEmail(invalidEmail) {
        await this.page.waitForTimeout(3000);
        await this.page.getByTestId(profilePageSelectors.editProfileButton.value).click();
        const emailInput = this.page.getByTestId('profile-email-input');
        await emailInput.clear();
        await emailInput.fill(invalidEmail);
        await this.page.getByRole('button', {
            name: 'Save Changes'
        }).click();
        await this.page.waitForTimeout(3000);
        await expect(
            this.page.getByTestId('profile-error')
        ).toHaveText('Please enter a valid email address.');
    }
}

export default ProfilePage;