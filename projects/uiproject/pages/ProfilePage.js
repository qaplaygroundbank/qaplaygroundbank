import { expect } from '@playwright/test';
import profilePageSelectors from '../selectors/profilePageSelectors.js';

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

    async verifyValidEmail(validEmail) {
        await this.page.getByTestId(profilePageSelectors.editProfileButton.value).click();
        const emailInput = this.page.getByTestId(profilePageSelectors.email.value);
        await emailInput.clear();
        await emailInput.fill(validEmail);
        await this.page.getByRole('button', {name: 'Save Changes'}).click();  
        const successMsg = this.page.getByTestId(profilePageSelectors.profileSuccessMessage.value);
        await expect(successMsg).toBeVisible();
        await expect(successMsg).toHaveText('Profile updated successfully.');    
    }

    async verifyInvalidEmail(invalidEmail) {
        await this.page.getByTestId(profilePageSelectors.editProfileButton.value).click();
        const emailInput = this.page.getByTestId(profilePageSelectors.email.value);
        await emailInput.clear();
        await emailInput.fill(invalidEmail);
        await this.page.getByRole('button', {name: 'Save Changes'}).click();  
        await expect(this.page.getByTestId(profilePageSelectors.profileErrorMessage.value)).toHaveText('Please enter a valid email address.');
    }
}

export default ProfilePage;