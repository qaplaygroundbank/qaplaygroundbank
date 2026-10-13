import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Profile Phone Validation Tests', () => {

    test(
        'PROF-11: Verify alphabetic characters are rejected in the Phone field @smoke',
        async ({ page, loginPage, profilePage }) => {

            // Arrange: Read credentials from .env
            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            // Assert: Credentials are available
            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            // Arrange: Open Login page and log in
            await loginPage.openLoginPage();

            await loginPage.login(
                username,
                password
            );

            // Assert 1: Login succeeded
            await expect(page).toHaveURL(
                /\/bank\/dashboard/
            );

            // Arrange: Open Profile
            await profilePage.navigateToProfile();

            // Assert 2: Profile page opened
            await profilePage.verifyProfileUrl();
            await profilePage.verifyProfilePageVisible();

            // Arrange: Open Edit mode
            await profilePage.clickEditProfile();

            // Assert 3: Phone field is visible
            await expect(
                profilePage.getPhoneInput()
            ).toBeVisible();

            // Assert 4: Phone field is editable
            await expect(
                profilePage.getPhoneInput()
            ).toBeEditable();

            // Store the original Phone value
            const originalPhone =
                await profilePage.getPhoneValue();

            console.log(
                'Original Phone value:',
                originalPhone
            );

            // Act: Enter alphabetic characters
            await profilePage.enterPhone('abcdefghij');

            // Assert 5: Correct test data was entered
            await expect(
                profilePage.getPhoneInput()
            ).toHaveValue('abcdefghij');

            // Act: Attempt to save
            await profilePage.clickSaveChanges();

            // Assert 6: Validation message is visible
            await expect(
                profilePage.getPhoneValidationMessage()
            ).toBeVisible();

            // Read the actual validation message
            const phoneValidationMessage =
                await profilePage
                    .getPhoneValidationMessage()
                    .textContent();

            // Print the validation message in the terminal
            console.log(
                'Phone validation message:',
                phoneValidationMessage
            );

            // Assert 7: Validation message is not empty
            expect(phoneValidationMessage).not.toBe('');

            // Assert 8: Correct validation message is shown
            expect(phoneValidationMessage).toContain(
                'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
            );

            // Assert 9: Save was blocked
            await expect(
                profilePage.getSaveChangesButton()
            ).toBeVisible();

            // Refresh to discard unsaved invalid data
            await page.reload();

            // Assert 10: Profile returned to view mode
            await profilePage.verifyEditProfileButton();

            // Reopen Edit mode
            await profilePage.clickEditProfile();

            // Assert 11: Invalid data was not saved
            await expect(
                profilePage.getPhoneInput()
            ).toHaveValue(originalPhone);

            // Read Phone value after reload
            const phoneAfterReload =
                await profilePage.getPhoneValue();

            console.log(
                'Phone value after reload:',
                phoneAfterReload
            );

            // Assert 12: Original Phone value remains
            expect(phoneAfterReload).toBe(originalPhone);

            // Return Profile to normal view mode
            await page.reload();

            await profilePage.verifyEditProfileButton();
        }
    );

});