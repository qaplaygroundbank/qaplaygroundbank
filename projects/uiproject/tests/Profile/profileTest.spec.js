import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import ProfilePage from '../../pages/ProfilePage.js';
import profileData from '../../testData/ProfileData.json' with { type: 'json' };

let profilePage;

// Common login steps for all Profile test cases
test.beforeEach(async ({ page }) => {

    const loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);

    // Open application
    await loginPage.openLoginPage();

    // Login using environment credentials
    await loginPage.login(
        process.env.UI_QA_USERNAME,
        process.env.UI_QA_PASSWORD
    );

    // Verify successful login
    await expect(page).toHaveURL(/dashboard/);
});

// PROF-007 - Reject Email With Missing Domain
test(
    '@smoke PROF-007 Reject Email With Missing Domain',
    async ({ page }) => {

        // Navigate to Profile
        await profilePage.navigateToProfile();

        // Open Edit mode
        await profilePage.clickEditProfile();

        // Save original Email
        const originalEmail =
            await profilePage.getEmailValue();

        // Enter invalid Email
        await profilePage.enterEmail(
            profileData.profile.missingDomainEmail
        );

        // Verify invalid Email was entered
        await expect(
            profilePage.getEmailInput()
        ).toHaveValue(
            profileData.profile.missingDomainEmail
        );

        // Attempt to save
        await profilePage.clickSaveChanges();

        // Read browser validation message
        const validationMessage =
            await profilePage.getEmailValidationMessage();

        console.log(
            'Email validation message:',
            validationMessage
        );

        // Verify validation message
        expect(validationMessage).toContain(
            "Please enter a part following '@'"
        );

        // Verify save was blocked
        await expect(
            profilePage.getSaveChangesButton()
        ).toBeVisible();

        // Reload to discard unsaved Email
        await page.reload();

        // Reopen Edit mode
        await profilePage.clickEditProfile();

        // Verify invalid Email was not saved
        await expect(
            profilePage.getEmailInput()
        ).toHaveValue(originalEmail);
    }
);


// PROF-011 - Reject Alphabetic Phone Input
test(
    '@smoke PROF-011 Reject Alphabetic Characters In Phone Field',
    async ({ page }) => {

        // Navigate to Profile
        await profilePage.navigateToProfile();

        // Open Edit mode
        await profilePage.clickEditProfile();

        // Save original Phone value
        const originalPhone =
            await profilePage.getPhoneValue();

        // Enter alphabetic Phone value
        await profilePage.enterPhone(
            profileData.profile.alphabeticPhone
        );

        // Verify test data was entered
        await expect(
            profilePage.getPhoneInput()
        ).toHaveValue(
            profileData.profile.alphabeticPhone
        );

        // Attempt to save
        await profilePage.clickSaveChanges();

        // Verify validation message is visible
        await expect(
            profilePage.getPhoneValidationMessage()
        ).toBeVisible();

        // Read the validation message
        const phoneValidationMessage =
            await profilePage
                .getPhoneValidationMessage()
                .textContent();

        console.log(
            'Phone validation message:',
            phoneValidationMessage
        );

        // Verify correct validation message
        expect(phoneValidationMessage).toContain(
            'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
        );

        // Verify save was blocked
        await expect(
            profilePage.getSaveChangesButton()
        ).toBeVisible();

        // Reload to discard unsaved Phone value
        await page.reload();

        // Reopen Edit mode
        await profilePage.clickEditProfile();

        // Verify invalid Phone was not saved
        await expect(
            profilePage.getPhoneInput()
        ).toHaveValue(originalPhone);
    }
);

// PROF-015 - Cancel Discards Unsaved Changes
test(
    '@smoke PROF-015 Cancel Discards Unsaved Profile Changes',
    async () => {

        // Navigate to Profile
        await profilePage.navigateToProfile();

        // Open Edit mode
        await profilePage.clickEditProfile();

        // Save all original values
        const originalFirstName =
            await profilePage.getFirstNameValue();

        const originalLastName =
            await profilePage.getLastNameValue();

        const originalEmail =
            await profilePage.getEmailValue();

        const originalPhone =
            await profilePage.getPhoneValue();

        const originalAddress =
            await profilePage.getAddressValue();

        // Enter temporary values
        await profilePage.enterFirstName(
            profileData.profile.temporaryFirstName
        );

        await profilePage.enterLastName(
            profileData.profile.temporaryLastName
        );

        await profilePage.enterEmail(
            profileData.profile.temporaryEmail
        );

        await profilePage.enterPhone(
            profileData.profile.temporaryPhone
        );

        await profilePage.enterAddress(
            profileData.profile.temporaryAddress
        );

        // Verify temporary values were entered
        await expect(
            profilePage.getFirstNameInput()
        ).toHaveValue(
            profileData.profile.temporaryFirstName
        );

        await expect(
            profilePage.getLastNameInput()
        ).toHaveValue(
            profileData.profile.temporaryLastName
        );

        await expect(
            profilePage.getEmailInput()
        ).toHaveValue(
            profileData.profile.temporaryEmail
        );

        await expect(
            profilePage.getPhoneInput()
        ).toHaveValue(
            profileData.profile.temporaryPhone
        );

        await expect(
            profilePage.getAddressInput()
        ).toHaveValue(
            profileData.profile.temporaryAddress
        );

        // Click Cancel without saving
        await profilePage.clickCancelEditProfile();

        // Verify Profile returned to view mode
        await profilePage.verifyEditProfileButton();

        // Reopen Edit mode
        await profilePage.clickEditProfile();

        // Verify original First Name was restored
        await expect(
            profilePage.getFirstNameInput()
        ).toHaveValue(originalFirstName);

        // Verify original Last Name was restored
        await expect(
            profilePage.getLastNameInput()
        ).toHaveValue(originalLastName);

        // Verify original Email was restored
        await expect(
            profilePage.getEmailInput()
        ).toHaveValue(originalEmail);

        // Verify original Phone was restored
        await expect(
            profilePage.getPhoneInput()
        ).toHaveValue(originalPhone);

        // Verify original Address was restored
        await expect(
            profilePage.getAddressInput()
        ).toHaveValue(originalAddress);
    }
);