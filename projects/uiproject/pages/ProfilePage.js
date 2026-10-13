import { expect } from '@playwright/test';
import profilePageSelectors from '../selectors/profilePageSelectors.js';

// Page Object Model for Profile page
class ProfilePage {

    // Initialize page instance
    constructor(page) {
        this.page = page;
    }

    // PROF-001 Profile Page Navigation

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

    // Verify Edit Profile button
    async verifyEditProfileButton() {
        await expect(
            this.page.getByTestId(profilePageSelectors.editProfileButton.value)
        ).toBeVisible();

        await expect(
            this.page.getByTestId(profilePageSelectors.editProfileButton.value)
        ).toBeEnabled();
    }

    // PROF-002 Profile Information Validation

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

    // Verify Email
    async verifyEmail(email) {
        await expect(
            this.page.getByTestId(profilePageSelectors.email.value)
        ).toHaveText(email);
    }

    // Verify Phone
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

    // PROF-012 Phone Boundary Validation

    // Click Edit Profile button
    async clickEditProfile() {
        await this.page
            .getByTestId(profilePageSelectors.editProfileButton.value)
            .click();
    }

    // Enter Phone Number
    async enterPhone(phoneNumber) {
        const phoneInput = this.page.getByTestId(
            profilePageSelectors.phoneInput.value
        );

        await phoneInput.clear();
        await phoneInput.fill(phoneNumber);
    }

    // Click Save Profile button
    async clickSaveProfile() {
        await this.page
            .getByTestId(profilePageSelectors.saveProfileButton.value)
            .click();
    }

    // Verify Phone Input Value
    async verifyPhoneValue(expectedPhone) {
        await expect(
            this.page.getByTestId(profilePageSelectors.phoneInput.value)
        ).toHaveValue(expectedPhone);
    }

    // Verify Phone Validation Error Message
    async verifyPhoneValidationMessage() {
        await expect(
            this.page.getByTestId(
                profilePageSelectors.phoneValidationError.value
            )
        ).toHaveText(
            'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
        );
    }
}

export default ProfilePage;