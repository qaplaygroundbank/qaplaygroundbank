import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import ProfilePage from '../../pages/ProfilePage.js';
import profileData from '../../testData/ProfileTestData.json' assert { type: 'json' };

let profilePage;

// Common login steps for all Profile test cases
test.beforeEach(async ({ page }) => {

    const loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);

    // Open the application login page
    await loginPage.openLoginPage();

    // Login using credentials from .env file
    await loginPage.login(
        process.env.UI_QA_USERNAME,
        process.env.UI_QA_PASSWORD
    );

    // Verify successful login
    await expect(page).toHaveURL(/dashboard/);
});

// PROF-001 - Verify user can access the Profile page
test('@smoke PROF-001 Verify User Can Successfully Access The Profile Page', async () => {

    // Navigate to Profile page
    await profilePage.navigateToProfile();

    // Verify Profile page components
    await profilePage.verifyProfileUrl();
    await profilePage.verifyProfilePageVisible();
    await profilePage.verifyProfileTitle();
    await profilePage.verifyPersonalInfoSection();
    await profilePage.verifyEditProfileButton();
});

// PROF-002 - Verify profile information is displayed correctly
test('@smoke PROF-002 Verify User Profile Information Is Displayed Correctly', async ({ page }) => {

    // Navigate to Profile page
    await profilePage.navigateToProfile();

    // Verify Profile page details
    await profilePage.verifyProfileUrl();
    await profilePage.verifyProfileTitle();

    // Verify user information
    await profilePage.verifyUsername(process.env.UI_QA_USERNAME);
    await profilePage.verifyFirstName(profileData.profile.firstName);
    await profilePage.verifyLastName(profileData.profile.lastName);
    await profilePage.verifyEmail(profileData.profile.email);
    await profilePage.verifyPhone(profileData.profile.phone);
    await profilePage.verifyAddress(profileData.profile.address);
});