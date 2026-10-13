import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import ProfilePage from '../../pages/ProfilePage.js';
import ProfileTestData from '../../testData/ProfileTestData.json' with { type: 'json' };

let loginPage;
let profilePage;
test.describe('Profile', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);
        await loginPage.openLoginPage();
        await loginPage.login(
            process.env.UI_QA_USERNAME,
            process.env.UI_QA_PASSWORD
        );
        await profilePage.navigateToProfile();
    });

    test('PROF-05 Verify a valid email can be entered/saved.',{ tag: ['@smoke', '@profile'] }, async () => {
        await profilePage.verifyValidEmail(
            ProfileTestData.ValidData.Email
        );
    });

    test('PROF-06 Verify invalid email format is rejected.',{ tag: ['@smoke', '@profile'] }, async () => {
        await profilePage.verifyInvalidEmail(
            ProfileTestData.InvalidEmailId.Email
        );
    });



});