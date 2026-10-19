import { expect } from '@playwright/test';
import BasePage from './BasePage.js';
import profilePageSelectors from '../selectors/profilePageSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';
import { URLS, VALIDATIONS } from '../utils/constants.js';

class ProfilePage extends BasePage {
    constructor(page) {
        super(page);

        this.profileLink = resolveLocator(page, profilePageSelectors.profileLink);
        this.profilePageTitle = resolveLocator(page, profilePageSelectors.profilePageTitle);
        this.editProfileButton = resolveLocator(page, profilePageSelectors.editProfileButton);
        this.phoneInput = resolveLocator(page, profilePageSelectors.phoneInput);
        this.submitButton = resolveLocator(page, profilePageSelectors.submitButton);
        this.profileSuccessMessage = resolveLocator(page, profilePageSelectors.profileSuccessMessage);
        this.phone = resolveLocator(page, profilePageSelectors.phone);
        this.email = resolveLocator(page, profilePageSelectors.email);
        this.profileErrorMessage = resolveLocator(page, profilePageSelectors.profileErrorMessage);
    }

    async getVisibleText(locator) {
        const text = await locator.textContent();
        return text ? text.trim() : '';
    }

    // Navigate to Profile page
    async navigateToProfile() {
        await this.profileLink.click();
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
        await this.submitButton.click();
        const successMsg = this.page.getByTestId(profilePageSelectors.profileSuccessMessage.value);
        await expect(successMsg).toBeVisible();
        await expect(successMsg).toHaveText('Profile updated successfully.');
    }

    async verifyInvalidEmail(invalidEmail) {
        await this.page.getByTestId(profilePageSelectors.editProfileButton.value).click();
        const emailInput = this.page.getByTestId(profilePageSelectors.email.value);
        await emailInput.clear();
        await emailInput.fill(invalidEmail);
        await this.submitButton.click();
        await expect(this.page.getByTestId(profilePageSelectors.profileErrorMessage.value)).toHaveText('Please enter a valid email address.');
    }

    // Verify Profile page URL
    async verifyProfileUrl() {
        await expect(this.page).toHaveURL(VALIDATIONS.PROFILE_URL);
    }


    // Verify Profile page title
    async verifyProfileTitle() {
        await expect(this.profilePageTitle).toHaveText(VALIDATIONS.PROFILE_TITLE);
    }

    //click on Edit button
    async tapOnEditProfileButton() {
        await this.editProfileButton.click();
    }

    async updateMobileNumber(newPhoneNumber) {
        const oldPhoneNumber = await this.phoneInput.inputValue();
        console.log('Old Phone Number:', oldPhoneNumber);
        await this.phoneInput.clear();
        await this.phoneInput.fill(newPhoneNumber);
        await expect(this.phoneInput).toHaveValue(newPhoneNumber);
    }

    async tapOnSaveProfileChanges() {
        await expect(this.submitButton).toBeVisible();
        await this.submitButton.click();
    }

    async saveChangebuttonIsEnabled() {
        await expect(this.submitButton).toBeEnabled();
    }

    async verifyProfileUpdateSuccessMessage(successMessage) {
        await expect(this.profileSuccessMessage).toBeVisible();
        await expect(this.profileSuccessMessage).toHaveText(successMessage);
        //success message should disappear after 5 seconds
        await expect(this.profileSuccessMessage).toBeHidden({ timeout: 5000 });
    }

    async refeshPageAndValidateupdatedPhoneNumber(newPhoneNumber) {
        await this.page.reload();
        const actualPhone = await this.phone.textContent();
        expect(actualPhone).toBe(newPhoneNumber);

    }

    async enterEmail(requiredEmail) {
        await this.email.fill(requiredEmail);
    }

    async clearEmailField() {
        await this.email.clear();

    }

    async clearPhoneField() {
        await this.phoneInput.clear();

    }

    async enterPhoneNumber(phoneNumber) {
        await this.phoneInput.fill(phoneNumber);
    }


    async verifyEmailErrorMessage(expectedErrorMessage) {
        await expect(this.profileErrorMessage).toHaveText(expectedErrorMessage);
    }

    async verifyPhoneErrorMessage(expectedPhoneErrorMessage) {
        const regexMatch = /^\/(.*)\/$/.exec(expectedPhoneErrorMessage);
        const expectedText = regexMatch
            ? new RegExp(regexMatch[1])
            : expectedPhoneErrorMessage;

        await expect(this.profileErrorMessage).toHaveText(expectedText);
    }

}
export default ProfilePage;