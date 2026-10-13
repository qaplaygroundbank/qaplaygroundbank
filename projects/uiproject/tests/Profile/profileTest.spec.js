import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import ProfilePage from '../../pages/ProfilePage.js';

test('Test Invalid Email address of Profile', async ({ page }) => {

    // Create page objects
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    // Open the application login page
    await loginPage.openLoginPage();

    // Login using credentials from .env file
    await loginPage.login(
        process.env.UI_QA_USERNAME,
        process.env.UI_QA_PASSWORD
    );

      // Navigate to Profile page
    await profilePage.navigateToProfile();

    // Verify Edit Profile button
    await profilePage.verifyEditProfileButton();

    // Verify Email Address
    await profilePage.verifyEmail(
        'alex.morgan@example.com'
    );

    //Verify Invalid address
    await profilePage.verifyInvalidEmail('xyz');

});