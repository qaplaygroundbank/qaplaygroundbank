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

    // Click Edit Profile button
    async clickEditProfile() {
        await this.page
            .getByTestId(profilePageSelectors.editProfileButton.value)
            .click();
    }
    // Update profile data
    async updateProfileData(firstname,lastname,email,phone,address) {

    // First Name
    const firstNameInput = this.page.getByTestId(
        profilePageSelectors.firstNameInput.value
    );
    await firstNameInput.clear();
    await firstNameInput.fill(firstname);

    // Last Name
    const lastNameInput = this.page.getByTestId(
        profilePageSelectors.lastNameInput.value
    );
    await lastNameInput.clear();
    await lastNameInput.fill(lastname);

    // Email
    const emailInput = this.page.getByTestId(
        profilePageSelectors.emailInput.value
    );
    await emailInput.clear();
    await emailInput.fill(email);

    // Phone
    const phoneInput = this.page.getByTestId(
        profilePageSelectors.phoneInput.value
    );
    await phoneInput.clear();
    await phoneInput.fill(phone);

    // Address
    const addressInput = this.page.getByTestId(
        profilePageSelectors.addressInput.value
    );
    await addressInput.clear();
    await addressInput.fill(address);
}

    // Click Save Profile button
    async clickSaveProfile() {
        await this.page
            .getByTestId(profilePageSelectors.saveProfileButton.value)
            .click();
    }

    // Verify Profile Save success message
    async verifyProfileSaveSuccessMessage() {
        await expect(
            this.page.getByTestId(
                profilePageSelectors.profileSaveSuccessMessage.value
            )
        ).toHaveText(
            'Profile updated successfully.'
        );
    }
    // Refresh Profile Page
    async refreshProfilePage() {
        await this.page.reload();
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
}

export default ProfilePage;