import { expect } from '@playwright/test';
import profilePageSelectors from '../selectors/profilePageSelectors.js';

// Page Object Model for Profile page
class ProfilePage {

    // Initialize page instance
    constructor(page) {
        this.page = page;
    }

    // Navigate to Profile page
    navigateToProfile() {
        return this.page
            .getByTestId(
                profilePageSelectors.profileLink.value
            )
            .click();
    }

    // Verify Profile page URL
    verifyProfileUrl() {
        return expect(this.page).toHaveURL(/profile/);
    }

    // Verify Profile page is displayed
    verifyProfilePageVisible() {
        return expect(
            this.page.getByTestId(
                profilePageSelectors.profilePage.value
            )
        ).toBeVisible();
    }

    // Verify Profile page title
    verifyProfileTitle() {
        return expect(
            this.page.getByTestId(
                profilePageSelectors.profilePageTitle.value
            )
        ).toHaveText('Profile & Settings');
    }

    // Verify Personal Information section
    verifyPersonalInfoSection() {
        return expect(
            this.page.getByTestId(
                profilePageSelectors.personalInfoSection.value
            )
        ).toBeVisible();
    }

    // Return Edit Profile button locator
    getEditProfileButton() {
        return this.page.getByTestId(
            profilePageSelectors.editProfileButton.value
        );
    }

    // Verify Edit Profile button
    verifyEditProfileButton() {
        return expect(
            this.getEditProfileButton()
        ).toBeVisible();
    }

    // Click Edit Profile button
    clickEditProfile() {
        return this.getEditProfileButton().click();
    }

    // Return First Name input locator
    getFirstNameInput() {
        return this.page.getByTestId(
            profilePageSelectors.firstNameInput.value
        );
    }

    // Read current First Name value
    getFirstNameValue() {
        return this.getFirstNameInput().inputValue();
    }

    // Enter First Name
    enterFirstName(firstName) {
        return this.getFirstNameInput().fill(firstName);
    }

    // Return Last Name input locator
    getLastNameInput() {
        return this.page.getByTestId(
            profilePageSelectors.lastNameInput.value
        );
    }

    // Read current Last Name value
    getLastNameValue() {
        return this.getLastNameInput().inputValue();
    }

    // Enter Last Name
    enterLastName(lastName) {
        return this.getLastNameInput().fill(lastName);
    }

    // Return Email input locator
    getEmailInput() {
        return this.page.getByTestId(
            profilePageSelectors.emailInput.value
        );
    }

    // Read current Email value
    getEmailValue() {
        return this.getEmailInput().inputValue();
    }

    // Enter Email
    enterEmail(email) {
        return this.getEmailInput().fill(email);
    }

    // Read browser-generated Email validation message
    getEmailValidationMessage() {
        return this.getEmailInput().evaluate(
            element => element.validationMessage
        );
    }

    // Return Phone input locator
    getPhoneInput() {
        return this.page.getByTestId(
            profilePageSelectors.phoneInput.value
        );
    }

    // Read current Phone value
    getPhoneValue() {
        return this.getPhoneInput().inputValue();
    }

    // Enter Phone
    enterPhone(phone) {
        return this.getPhoneInput().fill(phone);
    }

    // Return Phone validation message locator
    getPhoneValidationMessage() {
        return this.page.getByText(
            'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
        );
    }

    // Return Address input locator
    getAddressInput() {
        return this.page.getByTestId(
            profilePageSelectors.addressInput.value
        );
    }

    // Read current Address value
    getAddressValue() {
        return this.getAddressInput().inputValue();
    }

    // Enter Address
    enterAddress(address) {
        return this.getAddressInput().fill(address);
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

    // Return Cancel Edit button locator
    getCancelEditProfileButton() {
        return this.page.getByTestId(
            profilePageSelectors.cancelEditProfileButton.value
        );
    }

    // Click Cancel without saving
    clickCancelEditProfile() {
        return this.getCancelEditProfileButton().click();
    }

}
// Verify displayed 
export default ProfilePage;
        