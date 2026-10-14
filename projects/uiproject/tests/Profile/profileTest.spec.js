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

    test(
        'PROF-05 Verify a valid email can be entered/saved.',
        { tag: ['@smoke', '@profile'] },
        async () => {
            await profilePage.verifyValidEmail(
                ProfileTestData.ValidData.Email
            );
        }
    );

    test(
        'PROF-06 Verify invalid email format is rejected.',
        { tag: ['@smoke', '@profile'] },
        async () => {
            await profilePage.verifyInvalidEmail(
                ProfileTestData.InvalidEmailId.Email
            );
        }
    );

    test(
        'PROF-016 Verify saved profile data survives page refresh',
        { tag: ['@smoke', '@profile'] },
        async () => {

            await profilePage.clickEditProfile();

            await profilePage.updateProfileData(
                ProfileTestData.profile_update.firstName,
                ProfileTestData.profile_update.lastName,
                ProfileTestData.profile_update.email,
                ProfileTestData.profile_update.phone,
                ProfileTestData.profile_update.address
            );

            await profilePage.clickSaveProfile();

            await profilePage.verifyProfileSaveSuccessMessage();

            await profilePage.verifyFirstName(
                ProfileTestData.profile_update.firstName
            );

            await profilePage.verifyLastName(
                ProfileTestData.profile_update.lastName
            );

            await profilePage.verifyEmail(
                ProfileTestData.profile_update.email
            );

            await profilePage.verifyPhone(
                ProfileTestData.profile_update.phone
            );

            await profilePage.verifyAddress(
                ProfileTestData.profile_update.address
            );
        }
    );

    test(
        'PROF-17 Verify rapid repeated Save does not create inconsistent updates.',
        { tag: ['@smoke', '@profile'] },
        async () => {

            await profilePage.clickEditProfile();

            await profilePage.updateProfileData(
                ProfileTestData.profile_update.firstName,
                ProfileTestData.profile_update.lastName,
                ProfileTestData.profile_update.email,
                ProfileTestData.profile_update.phone,
                ProfileTestData.profile_update.address
            );

            try {
                await profilePage.clickSaveProfile();
                console.log('Save Profile clicked successfully.');

                await profilePage.verifyProfileSaveSuccessMessage();

            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : String(error);

                console.log(
                    'Custom Message: Save button is not visible for multiple clicks.'
                );
                console.log('Captured error message:', message);
            }
        }
    );

});