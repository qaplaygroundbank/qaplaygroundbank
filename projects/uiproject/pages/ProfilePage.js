import { expect } from '@playwright/test';
import profilePageSelectors from '../selectors/profilePageSelectors.js';

// Page Object Model for Profile page
class ProfilePage {

    // Initialize page instance
    constructor(page) {
        this.page = page;
    }

    // Navigate to Profile page
    async navigateToProfile() {
        await this.page
            .getByTestId(profilePageSelectors.profileLink.value)
            .click();
    }

    // Verify Profile page URL
    async verifyProfileUrl() {
        await expect(this.page).toHaveURL(/profile/);
    }

    // Verify Profile page is displayed
    async verifyProfilePageVisible() {
        await expect(
            this.page.getByTestId(profilePageSelectors.profilePage.value)
        ).toBeVisible();
    }

    // Verify Profile page title
    async verifyProfileTitle() {
        await expect(
            this.page.getByTestId(profilePageSelectors.profilePageTitle.value)
        ).toHaveText('Profile & Settings');
    }

    // Verify Personal Information section
    async verifyPersonalInfoSection() {
        await expect(
            this.page.getByTestId(profilePageSelectors.personalInfoSection.value)
        ).toBeVisible();
    }

    // Verify Edit Profile button is visible and enabled
    async verifyEditProfileButton() {
        await expect(
            this.page.getByTestId(profilePageSelectors.editProfileButton.value)
        ).toBeVisible();

        await expect(
            this.page.getByTestId(profilePageSelectors.editProfileButton.value)
        ).toBeEnabled();
    }

    // Verify Username
    async verifyUsername(username) {
        await expect(
            this.page.getByTestId(profilePageSelectors.username.value)
        ).toHaveText(username);
    }

    // Verify First Name
    async verifyFirstName(firstName) {
        await expect(
            this.page.getByTestId(profilePageSelectors.firstName.value)
        ).toHaveText(firstName);
    }

    // Verify Last Name
    async verifyLastName(lastName) {
        await expect(
            this.page.getByTestId(profilePageSelectors.lastName.value)
        ).toHaveText(lastName);
    }

    // Verify Email Address
    async verifyEmail(email) {
        await expect(
            this.page.getByTestId(profilePageSelectors.email.value)
        ).toHaveText(email);
    }

    // Verify Phone Number
    async verifyPhone(phone) {
        await expect(
            this.page.getByTestId(profilePageSelectors.phone.value)
        ).toHaveText(phone);
    }

    // Verify Address
    async verifyAddress(address) {
        await expect(
            this.page.getByTestId(profilePageSelectors.address.value)
        ).toHaveText(address);
    }
}

export default ProfilePage;