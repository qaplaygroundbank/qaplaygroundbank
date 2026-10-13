import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Profile Email Validation Tests', () => {

    test(
        'PROF-07: Verify validation error when email domain is missing @smoke',
        async ({ page, loginPage, profilePage }) => {

            // Arrange: Read credentials loaded from .env
            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            // Assert: Credentials are available
            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            // Arrange: Open the Login page
            await loginPage.openLoginPage();

            // Arrange: Log in using valid credentials
            await loginPage.login(
                username,
                password
            );

            // Assert: Login was successful
            await expect(page).toHaveURL(
                /\/bank\/dashboard/
            );

            // Arrange: Navigate to Profile
            await profilePage.navigateToProfile();

            // Assert: Profile page opened
            await profilePage.verifyProfileUrl();
            await profilePage.verifyProfilePageVisible();

            // Arrange: Open Edit mode
            await profilePage.clickEditProfile();

            // Assert: Email field is visible and editable
            await expect(
                profilePage.getEmailInput()
            ).toBeVisible();

            await expect(
                profilePage.getEmailInput()
            ).toBeEditable();

            // Store original saved Email
            const originalEmail =
                await profilePage.getEmailValue();

            // Act: Enter an Email with a missing domain
            await profilePage.enterEmail('admin@');

            // Assert 1: Correct test data was entered
            await expect(
                profilePage.getEmailInput()
            ).toHaveValue('admin@');

            // Act: Attempt to save invalid Email
            await profilePage.clickSaveChanges();

            // Get the browser-generated validation message
            const validationMessage =
                await profilePage
                    .getEmailValidationMessage();

            // Print the message in the terminal for evidence
            console.log(
                'Email validation message:',
                validationMessage
            );

            // Assert 2: A validation message was generated
            expect(validationMessage).not.toBe('');

            // Assert 3: The validation message explains
            // that the part after @ is missing
            expect(validationMessage).toContain(
                "Please enter a part following '@'"
            );

            // Assert 4: Save was blocked
            // Save Changes remains visible in Edit mode
            await expect(
                profilePage.getSaveChangesButton()
            ).toBeVisible();

            // Refresh to remove unsaved invalid data
            await page.reload();

            // Assert 5: Profile returned to view mode
            await profilePage.verifyEditProfileButton();

            // Open Edit mode again
            await profilePage.clickEditProfile();

            // Assert 6: Invalid Email was not persisted
            await expect(
                profilePage.getEmailInput()
            ).toHaveValue(originalEmail);

            // Reload to leave Profile in normal view mode
            await page.reload();

            // Assert 7: Profile is in normal view mode
            await profilePage.verifyEditProfileButton();
        }
    );

});