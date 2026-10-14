import { expect } from '@playwright/test';
import BasePage from './BasePage.js';
import profilePageSelectors from '../selectors/profilePageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

class ProfilePage extends BasePage {

    constructor(page) {
        super(page);

        // Profile page locators
        this.profileLink = resolveLocator(
            page,
            profilePageSelectors.profileLink
        );

        this.profilePage = resolveLocator(
            page,
            profilePageSelectors.profilePage
        );

        this.profilePageTitle = resolveLocator(
            page,
            profilePageSelectors.profilePageTitle
        );

        this.personalInfoSection = resolveLocator(
            page,
            profilePageSelectors.personalInfoSection
        );

        this.editProfileButton = resolveLocator(
            page,
            profilePageSelectors.editProfileButton
        );

        // Profile values in view mode
        this.username = resolveLocator(
            page,
            profilePageSelectors.username
        );

        this.firstName = resolveLocator(
            page,
            profilePageSelectors.firstName
        );

        this.lastName = resolveLocator(
            page,
            profilePageSelectors.lastName
        );

        this.email = resolveLocator(
            page,
            profilePageSelectors.email
        );

        this.phone = resolveLocator(
            page,
            profilePageSelectors.phone
        );

        this.address = resolveLocator(
            page,
            profilePageSelectors.address
        );

        // Editable Profile fields
        this.firstNameInput = resolveLocator(
            page,
            profilePageSelectors.firstNameInput
        );

        this.lastNameInput = resolveLocator(
            page,
            profilePageSelectors.lastNameInput
        );

        this.emailInput = resolveLocator(
            page,
            profilePageSelectors.emailInput
        );

        this.phoneInput = resolveLocator(
            page,
            profilePageSelectors.phoneInput
        );

        this.addressInput = resolveLocator(
            page,
            profilePageSelectors.addressInput
        );

        // Buttons and messages
        this.submitButton = resolveLocator(
            page,
            profilePageSelectors.submitButton
        );

        this.cancelEditProfileButton = resolveLocator(
            page,
            profilePageSelectors.cancelEditProfileButton
        );

        this.profileErrorMessage = resolveLocator(
            page,
            profilePageSelectors.profileErrorMessage
        );

        this.profileSuccessMessage = resolveLocator(
            page,
            profilePageSelectors.profileSuccessMessage
        );
    }

    async navigateToProfile() {
        await this.profileLink.click();
    }

    async verifyPersonalInfoSection() {
        await expect(
            this.personalInfoSection
        ).toBeVisible();
    }

    async verifyEditProfileButton() {
        await expect(
            this.editProfileButton
        ).toBeVisible();

        await expect(
            this.editProfileButton
        ).toBeEnabled();
    }

    async clickEditProfile() {
        await this.editProfileButton.click();
    }

    async clickSaveChanges() {
        await this.submitButton.click();
    }
    async _readFieldValue(
        displayLocator,
        inputLocator
    ) {
        const inputVisible =
            await inputLocator
                .isVisible()
                .catch(() => false);

        if (inputVisible) {
            return inputLocator.inputValue();
        }

        const displayCount =
            await displayLocator.count();

        if (displayCount > 0) {
            return displayLocator.textContent();
        }

        return inputLocator.inputValue();
    }

    async getFirstNameValue() {
        return this._readFieldValue(
            this.firstName,
            this.firstNameInput
        );
    }

    async getLastNameValue() {
        return this._readFieldValue(
            this.lastName,
            this.lastNameInput
        );
    }

    async getEmailValue() {
        return this._readFieldValue(
            this.email,
            this.emailInput
        );
    }

    async getPhoneValue() {
        return this._readFieldValue(
            this.phone,
            this.phoneInput
        );
    }

    async getAddressValue() {
        return this._readFieldValue(
            this.address,
            this.addressInput
        );
    }

    getFirstNameInput() {
        return this.firstNameInput;
    }

    getLastNameInput() {
        return this.lastNameInput;
    }

    getEmailInput() {
        return this.emailInput;
    }

    getPhoneInput() {
        return this.phoneInput;
    }

    getAddressInput() {
        return this.addressInput;
    }

    async enterFirstName(value) {
        await this.firstNameInput.fill(value);
    }

    async enterLastName(value) {
        await this.lastNameInput.fill(value);
    }

    async enterEmail(value) {
        await this.emailInput.fill(value);
    }

    async enterPhone(value) {
        await this.phoneInput.fill(value);
    }

    async enterAddress(value) {
        await this.addressInput.fill(value);
    }

    getSaveChangesButton() {
        return this.submitButton;
    }

    getEmailValidationMessage() {
        return this.profileErrorMessage.textContent();
    }

    getPhoneValidationMessage() {
        return this.profileErrorMessage;
    }

    async verifyValidEmail(validEmail) {
        await this.clickEditProfile();

        await this.emailInput.clear();
        await this.emailInput.fill(validEmail);

        await this.clickSaveChanges();

        await expect(
            this.profileSuccessMessage
        ).toBeVisible();

        await expect(
            this.profileSuccessMessage
        ).toHaveText(
            'Profile updated successfully.'
        );
    }

    async verifyInvalidEmail(invalidEmail) {
        await this.clickEditProfile();

        await this.emailInput.clear();
        await this.emailInput.fill(invalidEmail);

        await this.clickSaveChanges();

        await expect(
            this.profileErrorMessage
        ).toHaveText(
            'Please enter a valid email address.'
        );
    }
    // Return Cancel Edit Profile button
    getCancelEditProfileButton() {
        return this.cancelEditProfileButton;
    }

    // Click Cancel without saving
    async clickCancelEditProfile() {
        await this.cancelEditProfileButton.click();
    }
}

export default ProfilePage;