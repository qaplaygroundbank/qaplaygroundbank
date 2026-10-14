import { expect } from '@playwright/test';
import profilePageSelectors from '../selectors/profilePageSelectors.js';
import BasePage from './BasePage.js';

class ProfilePage extends BasePage {
    constructor(page) {
        super(page);
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

    // Click Edit Profile button
    async clickEditProfile() {
        await this.page
            .getByTestId(profilePageSelectors.editProfileButton.value)
            .click();
    }

    // Verify Profile Email
    async verifyProfileEmail(email) {
        await expect(
            this.page.getByTestId(profilePageSelectors.profileEmail.value)).toHaveText(email);
    }

    // Enter Phone Number
    async enterPhone(phoneNumber) {
        const phoneInput = this.page.getByTestId(
            profilePageSelectors.phoneInput.value);

        await phoneInput.clear();
        await phoneInput.fill(phoneNumber);
    }

    // Click Save Profile button
    async clickSaveProfile() {
        await this.page
            .getByTestId(profilePageSelectors.submitButton.value)
            .click();
    }

    // Verify Phone Input Value
    async verifyPhoneValue(expectedPhone) {
        await expect(
            this.page.getByTestId(profilePageSelectors.phoneInput.value)
        ).toHaveValue(expectedPhone);
    }

    // Verify Phone Validation Message
    async verifyPhoneValidationMessage() {
        await expect(
            this.page.getByTestId(
                profilePageSelectors.phoneValidationError.value
            )
        ).toHaveText(
            'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
        );
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