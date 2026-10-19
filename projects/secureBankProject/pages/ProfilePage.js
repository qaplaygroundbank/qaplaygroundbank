import { expect } from '@playwright/test';
import BasePage from './BasePage.js';
import profilePageSelectors from '../selectors/profilePageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';
import { VALIDATIONS } from '../utils/constants.js';

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

        // Buttons
        this.submitButton = resolveLocator(
            page,
            profilePageSelectors.submitButton
        );

        this.cancelEditProfileButton = resolveLocator(
            page,
            profilePageSelectors.cancelEditProfileButton
        );

        // Validation and success messages
        this.profileErrorMessage = resolveLocator(
            page,
            profilePageSelectors.profileErrorMessage
        );

        this.profileSuccessMessage = resolveLocator(
            page,
            profilePageSelectors.profileSuccessMessage
        );
    }

    // Navigate to Profile page
    async navigateToProfile() {
        await this.profileLink.click();
        await expect(this.profilePageTitle).toBeVisible();
        await expect(this.personalInfoSection).toBeVisible();
    }

    // Verify Profile page URL
    async verifyProfileUrl() {
        await expect(
            this.page
        ).toHaveURL(
            VALIDATIONS.PROFILE_URL
        );
    }

    // Verify Profile page title
    async verifyProfileTitle() {
        await expect(
            this.profilePageTitle
        ).toHaveText(
            VALIDATIONS.PROFILE_TITLE
        );
    }

    // Verify Personal Information section
    async verifyPersonalInfoSection() {
        await expect(
            this.personalInfoSection
        ).toBeVisible();
    }

    // Verify Edit Profile button
    async verifyEditProfileButton() {
        await expect(
            this.editProfileButton
        ).toBeVisible();

        await expect(
            this.editProfileButton
        ).toBeEnabled();
    }

    // Click Edit Profile
    async clickEditProfile() {
        await this.editProfileButton.click();
    }

    // Click Save Changes
    async clickSaveChanges() {
        await this.submitButton.click();
    }

    // Click Cancel without saving
    async clickCancelEditProfile() {
        await this.cancelEditProfileButton.click();
    }

    // Read a Profile value from view mode or Edit mode
    async _readFieldValue(
        displayLocator,
        inputLocator,
        fieldName
    ) {
        await expect.poll(
            async () => (
                await inputLocator.isVisible() ||
                await displayLocator.isVisible()
            ),
            {
                message:
                    `${fieldName} should be visible in view mode or edit mode.`
            }
        ).toBe(true);

        if (await inputLocator.isVisible()) {
            return inputLocator.inputValue();
        }

        const displayedValue =
            await displayLocator.textContent();

        return displayedValue?.trim() ?? '';
    }

    _getProfileFieldLocators(fieldName) {
        const fields = {
            firstName: {
                display: this.firstName,
                input: this.firstNameInput
            },
            lastName: {
                display: this.lastName,
                input: this.lastNameInput
            },
            email: {
                display: this.email,
                input: this.emailInput
            },
            phone: {
                display: this.phone,
                input: this.phoneInput
            },
            address: {
                display: this.address,
                input: this.addressInput
            }
        };
        const field = fields[fieldName];

        if (!field) {
            throw new Error(
                `Unsupported profile field "${fieldName}".`
            );
        }

        return field;
    }

    async getProfileFieldValue(fieldName) {
        const field = this._getProfileFieldLocators(fieldName);

        return this._readFieldValue(
            field.display,
            field.input,
            fieldName
        );
    }

    async restoreProfileField(fieldName, originalValue) {
        const field = this._getProfileFieldLocators(fieldName);

        if (!(await field.input.isVisible())) {
            await this.clickEditProfile();
        }

        await field.input.fill(originalValue);
        await this.clickSaveChanges();
        await expect(this.profileSuccessMessage).toBeVisible();
        await this.page.reload();
        await expect.poll(
            () => this.getProfileFieldValue(fieldName)
        ).toBe(originalValue);
    }

    // Read First Name value
    async getFirstNameValue() {
        return this._readFieldValue(
            this.firstName,
            this.firstNameInput,
            'First Name'
        );
    }

    // Read Last Name value
    async getLastNameValue() {
        return this._readFieldValue(
            this.lastName,
            this.lastNameInput,
            'Last Name'
        );
    }

    // Read Email value
    async getEmailValue() {
        return this._readFieldValue(
            this.email,
            this.emailInput,
            'Email'
        );
    }

    // Read Phone value
    async getPhoneValue() {
        return this._readFieldValue(
            this.phone,
            this.phoneInput,
            'Phone'
        );
    }

    // Read Address value
    async getAddressValue() {
        return this._readFieldValue(
            this.address,
            this.addressInput,
            'Address'
        );
    }

    // Return First Name input locator
    getFirstNameInput() {
        return this.firstNameInput;
    }

    // Return Last Name input locator
    getLastNameInput() {
        return this.lastNameInput;
    }

    // Return Email input locator
    getEmailInput() {
        return this.emailInput;
    }

    // Return Phone input locator
    getPhoneInput() {
        return this.phoneInput;
    }

    // Return Address input locator
    getAddressInput() {
        return this.addressInput;
    }

    // Return Save Changes button locator
    getSaveChangesButton() {
        return this.submitButton;
    }

    // Return Cancel button locator
    getCancelEditProfileButton() {
        return this.cancelEditProfileButton;
    }

    // Return success-message locator
    getProfileSuccessMessage() {
        return this.profileSuccessMessage;
    }

    // Return error-message locator
    getProfileErrorMessage() {
        return this.profileErrorMessage;
    }

    // Enter First Name
    async enterFirstName(value) {
        await this.firstNameInput.fill(value);
    }

    // Enter Last Name
    async enterLastName(value) {
        await this.lastNameInput.fill(value);
    }

    // Enter Email
    async enterEmail(value) {
        await this.emailInput.fill(value);
    }

    // Enter Phone
    async enterPhone(value) {
        await this.phoneInput.fill(value);
    }

    // Enter Address
    async enterAddress(value) {
        await this.addressInput.fill(value);
    }

    // Read Email validation message
    async getEmailValidationMessage() {
        return this.profileErrorMessage.textContent();
    }

    // Return Phone validation-message locator
    getPhoneValidationMessage() {
        return this.profileErrorMessage;
    }

    // Verify that a valid Email can be saved
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

    // Verify that an invalid Email is rejected
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

    // Click Edit Profile for PROF-003
    async tapOnEditProfileButton() {
        await this.editProfileButton.click();
    }

    // Update Phone number
    async updateMobileNumber(newPhoneNumber) {
        const oldPhoneNumber =
            await this.phoneInput.inputValue();

        console.log(
            'Old Phone Number:',
            oldPhoneNumber
        );

        await this.phoneInput.clear();
        await this.phoneInput.fill(
            newPhoneNumber
        );

        await expect(
            this.phoneInput
        ).toHaveValue(
            newPhoneNumber
        );
    }

    // Click Save Profile Changes
    async tapOnSaveProfileChanges() {
        await expect(
            this.submitButton
        ).toBeVisible();

        await this.submitButton.click();
    }

    // Verify success message
    async verifyProfileUpdateSuccessMessage(
        successMessage
    ) {
        await expect(
            this.profileSuccessMessage
        ).toBeVisible();

        await expect(
            this.profileSuccessMessage
        ).toHaveText(
            successMessage
        );

        // Success message should disappear
        await expect(
            this.profileSuccessMessage
        ).toBeHidden({
            timeout: 5000
        });
    }

    // Refresh and verify updated Phone number
    async refreshPageAndValidateUpdatedPhoneNumber(
    newPhoneNumber) 
    {
    await this.page.reload();

    const actualPhone =
        await this.getPhoneValue();

    expect(actualPhone).toBe(
        newPhoneNumber
    );
    }
}

export default ProfilePage;