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
            .getByTestId(
                profilePageSelectors.profileLink.value
            )
            .click();
    }

    // Verify Profile page URL
    async verifyProfileUrl() {
        await expect(this.page).toHaveURL(/profile/);
    }

    // Verify Profile page is displayed
    async verifyProfilePageVisible() {
        await expect(
            this.page.getByTestId(
                profilePageSelectors.profilePage.value
            )
        ).toBeVisible();
    }

    // Verify Profile page title
    async verifyProfileTitle() {
        await expect(
            this.page.getByTestId(
                profilePageSelectors.profilePageTitle.value
            )
        ).toHaveText('Profile & Settings');
    }

    // Verify Personal Information section
    async verifyPersonalInfoSection() {
        await expect(
            this.page.getByTestId(
                profilePageSelectors.personalInfoSection.value
            )
        ).toBeVisible();
    }

    // Verify Edit Profile button is visible and enabled
    async verifyEditProfileButton() {
        const editProfileButton = this.page.getByTestId(
            profilePageSelectors.editProfileButton.value
        );

        await expect(editProfileButton).toBeVisible();
        await expect(editProfileButton).toBeEnabled();
    }

    // Click Edit Profile button
    clickEditProfile() {
        return this.page
            .getByTestId(
                profilePageSelectors.editProfileButton.value
            )
            .click();
    }

    // Return Email input locator in Edit mode
    getEmailInput() {
        return this.page.getByTestId(
            profilePageSelectors.emailInput.value
        );
    }

    // Read the current Email value
    getEmailValue() {
        return this.getEmailInput().inputValue();
    }

    // Enter an Email value
    enterEmail(email) {
        return this.getEmailInput().fill(email);
    }

    // Read the browser-generated Email validation message
    getEmailValidationMessage() {
        return this.getEmailInput().evaluate(
            element => element.validationMessage
        );
    }

    // Return Save Changes button locator
    getSaveChangesButton() {
        return this.page.getByRole(
            'button',
            { name: 'Save Changes' }
        );
    }

    // Click Save Changes
    clickSaveChanges() {
        return this.getSaveChangesButton().click();
    }

    // Verify Username
    async verifyUsername(username) {
        await expect(
            this.page.getByTestId(
                profilePageSelectors.username.value
            )
        ).toHaveText(username);
    }

    // Verify First Name
    async verifyFirstName(firstName) {
        await expect(
            this.page.getByTestId(
                profilePageSelectors.address.value
            )
        ).toHaveText(address);
    }
    // Return Phone input locator in Edit mode
    getPhoneInput() {
        return this.page.getByTestId(
            profilePageSelectors.phoneInput.value
        );
    }

    // Read the existing Phone value
    getPhoneValue() {
        return this.getPhoneInput().inputValue();
    }

    // Enter a Phone value
    enterPhone(phone) {
        return this.getPhoneInput().fill(phone);
    }

    // Return the Phone validation message locator
    getPhoneValidationMessage() {
        return this.page.getByText(
            'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
        );
    }
}
export default ProfilePage;
        