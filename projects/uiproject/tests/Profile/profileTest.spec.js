import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import ProfilePage from '../../pages/ProfilePage.js';
import profileData from '../../testData/ProfileData.json' assert { type: 'json' };

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

// PROF-001 - Verify User Can Successfully Access The Profile Page

test('@smoke PROF-001 Verify User Can Successfully Access The Profile Page', async () => {

    // Navigate to Profile page
    await profilePage.navigateToProfile();

    // Verify Profile page UI components
    await profilePage.verifyProfileUrl();
    await profilePage.verifyProfilePageVisible();
    await profilePage.verifyProfileTitle();
    await profilePage.verifyPersonalInfoSection();
    await profilePage.verifyEditProfileButton();
});

// PROF-002 - Verify User Profile Information Is Displayed Correctly

test('@smoke PROF-002 Verify User Profile Information Is Displayed Correctly', async () => {

    // Navigate to Profile page
    await profilePage.navigateToProfile();

    // Verify Profile page
    await profilePage.verifyProfileUrl();
    await profilePage.verifyProfileTitle();

    // Verify profile details
    await profilePage.verifyUsername(
        process.env.UI_QA_USERNAME
    );

    await profilePage.verifyFirstName(
        profileData.profile.firstName
    );

    await profilePage.verifyLastName(
        profileData.profile.lastName
    );

    await profilePage.verifyEmail(
        profileData.profile.email
    );

    await profilePage.verifyPhone(
        profileData.profile.phone
    );

    await profilePage.verifyAddress(
        profileData.profile.address
    );
});


// PROF-012 - Verify Phone Boundary Length Validation

test('@smoke PROF-012 Verify Phone Boundary Length Is Validated', async () => {

    // Navigate to Profile page
    await profilePage.navigateToProfile();

    // Open Edit Profile mode
    await profilePage.clickEditProfile();

    // Enter phone number exceeding supported length
    await profilePage.enterPhone(
        profileData.profile.aboveMaxPhone
    );

    // Save profile changes
    await profilePage.clickSaveProfile();

    // Verify phone validation message
    await profilePage.verifyPhoneValidationMessage();

    // Enter valid phone number
    await profilePage.enterPhone(
        profileData.profile.validPhone
    );

    // Verify phone field value
    await profilePage.verifyPhoneValue(
        profileData.profile.validPhone
    );
});