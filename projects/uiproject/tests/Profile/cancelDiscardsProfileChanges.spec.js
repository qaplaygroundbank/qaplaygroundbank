import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Profile Cancel and Discard Tests', () => {

    test(
        'PROF-15: Verify Cancel discards unsaved changes for all Profile fields @smoke',
        async ({ page, loginPage, profilePage }) => {

            // Read credentials from .env
            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            // Log in
            await loginPage.openLoginPage();

            await loginPage.login(
                username,
                password
            );

            // Verify login succeeded
            await expect(page).toHaveURL(
                /\/bank\/dashboard/
            );

            // Open Profile
            await profilePage.navigateToProfile();

            // Verify Profile page opened
            await profilePage.verifyProfileUrl();
            await profilePage.verifyProfilePageVisible();

            // Open Edit mode
            await profilePage.clickEditProfile();

            // Store all original values
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

            console.log(
                'Original First Name:',
                originalFirstName
            );

            console.log(
                'Original Last Name:',
                originalLastName
            );

            console.log(
                'Original Email:',
                originalEmail
            );

            console.log(
                'Original Phone:',
                originalPhone
            );

            console.log(
                'Original Address:',
                originalAddress
            );

            // Temporary valid test data
            const temporaryFirstName = 'TestFirst';
            const temporaryLastName = 'TestLast';

            const temporaryEmail =
                'temporary.profile@example.com';

            const temporaryPhone =
                '(415) 555-0101';

            const temporaryAddress =
                '100 Test Avenue, Bengaluru, KA 560001';

            // Change all fields
            await profilePage.enterFirstName(
                temporaryFirstName
            );

            await profilePage.enterLastName(
                temporaryLastName
            );

            await profilePage.enterEmail(
                temporaryEmail
            );

            await profilePage.enterPhone(
                temporaryPhone
            );

            await profilePage.enterAddress(
                temporaryAddress
            );

            // Verify all temporary values were entered
            await expect(
                profilePage.getFirstNameInput()
            ).toHaveValue(temporaryFirstName);

            await expect(
                profilePage.getLastNameInput()
            ).toHaveValue(temporaryLastName);

            await expect(
                profilePage.getEmailInput()
            ).toHaveValue(temporaryEmail);

            await expect(
                profilePage.getPhoneInput()
            ).toHaveValue(temporaryPhone);

            await expect(
                profilePage.getAddressInput()
            ).toHaveValue(temporaryAddress);

            // Click Cancel without saving
            await profilePage.clickCancelEditProfile();

            // Verify Profile returned to normal view mode
            await profilePage.verifyEditProfileButton();

            // Open Edit mode again
            await profilePage.clickEditProfile();

            // Verify all original values were restored
            await expect(
                profilePage.getFirstNameInput()
            ).toHaveValue(originalFirstName);

            await expect(
                profilePage.getLastNameInput()
            ).toHaveValue(originalLastName);

            await expect(
                profilePage.getEmailInput()
            ).toHaveValue(originalEmail);

            await expect(
                profilePage.getPhoneInput()
            ).toHaveValue(originalPhone);

            await expect(
                profilePage.getAddressInput()
            ).toHaveValue(originalAddress);

            // Print restored values for evidence
            console.log(
                'Restored First Name:',
                await profilePage.getFirstNameValue()
            );

            console.log(
                'Restored Last Name:',
                await profilePage.getLastNameValue()
            );

            console.log(
                'Restored Email:',
                await profilePage.getEmailValue()
            );

            console.log(
                'Restored Phone:',
                await profilePage.getPhoneValue()
            );

            console.log(
                'Restored Address:',
                await profilePage.getAddressValue()
            );

            // Return Profile to normal view mode
            await page.reload();

            await profilePage.verifyEditProfileButton();
        }
    );

});