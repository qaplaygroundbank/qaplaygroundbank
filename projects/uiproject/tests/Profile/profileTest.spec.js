import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import ProfilePage from '../../pages/ProfilePage.js';
import ProfileTestData from '../../testData/ProfileTestData.json'
    with { type: 'json' };

test.describe('Profile Tests', () => {

    let loginPage;
    let profilePage;

    // Common login and Profile navigation
    test.beforeEach(async ({ page }) => {

        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);

        await loginPage.openLoginPage();

        await loginPage.login(
            process.env.UI_QA_USERNAME,
            process.env.UI_QA_PASSWORD
        );

        await expect(page).toHaveURL(/dashboard/);

        await profilePage.navigateToProfile();
    });


    // PROF-07: Verify Email with missing domain is rejected

    test(
        'PROF-07 Verify Email with missing domain is rejected',
        {
            tag: ['@smoke', '@profile']
        },
        async ({ page }) => {

            const testEmail =
                ProfileTestData.MissingDomainEmail.Email;

            // Open Edit mode
            await profilePage.clickEditProfile();

            // Store the original Email
            const originalEmail =
                await profilePage.getEmailValue();

            // Enter Email without domain
            await profilePage.enterEmail(testEmail);

            // Verify test data was entered
            await expect(
                profilePage.getEmailInput()
            ).toHaveValue(testEmail);

            // Attempt to save
            await profilePage.clickSaveChanges();

            // Read browser-generated validation message
            const validationMessage =
                await profilePage
                    .getEmailValidationMessage();

            console.log(
                'Email validation message:',
                validationMessage
            );

            // Verify missing-domain validation
            expect(validationMessage).toContain(
                'Please enter a valid email address.'
            );

            // Verify Save was blocked
            await expect(
                profilePage.getSaveChangesButton()
            ).toBeVisible();

            // Discard the unsaved invalid value
            await page.reload();

            // Reopen Edit mode
            await profilePage.clickEditProfile();

            // Verify invalid Email was not persisted
            await expect(
                profilePage.getEmailInput()
            ).toHaveValue(originalEmail);
        }
    );


    // PROF-11: Verify alphabetic Phone input is rejected

    test(
        'PROF-11 Verify alphabetic characters are rejected in Phone field',
        {
            tag: ['@smoke', '@profile']
        },
        async ({ page }) => {

            const alphabeticPhone =
                ProfileTestData.AlphabeticPhone.Phone;

            // Open Edit mode
            await profilePage.clickEditProfile();

            // Store the original Phone value
            const originalPhone =
                await profilePage.getPhoneValue();

            console.log(
                'Original Phone value:',
                originalPhone
            );

            // Enter alphabetic Phone value
            await profilePage.enterPhone(
                alphabeticPhone
            );

            // Verify test data was entered
            await expect(
                profilePage.getPhoneInput()
            ).toHaveValue(alphabeticPhone);

            // Attempt to save
            await profilePage.clickSaveChanges();

            // Verify Phone validation is visible
            await expect(
                profilePage.getPhoneValidationMessage()
            ).toBeVisible();

            // Read actual validation text
            const phoneValidationMessage =
                await profilePage
                    .getPhoneValidationMessage()
                    .textContent();

            console.log(
                'Phone validation message:',
                phoneValidationMessage
            );

            // Verify the validation message
            expect(phoneValidationMessage).toContain(
                'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
            );

            // Verify Save was blocked
            await expect(
                profilePage.getSaveChangesButton()
            ).toBeVisible();

            // Discard the unsaved invalid value
            await page.reload();

            // Reopen Edit mode
            await profilePage.clickEditProfile();

            // Verify invalid Phone was not persisted
            await expect(
                profilePage.getPhoneInput()
            ).toHaveValue(originalPhone);
        }
    );


    // PROF-15: Verify Cancel discards unsaved changes

    test(
        'PROF-15 Verify Cancel discards unsaved Profile changes',
        {
            tag: ['@smoke', '@profile']
        },
        async () => {

            const temporaryData =
                ProfileTestData.TemporaryProfileData;

            // Open Edit mode
            await profilePage.clickEditProfile();

            // Store the original persisted values
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

            // Enter temporary Profile values
            await profilePage.enterFirstName(
                temporaryData.FirstName
            );

            await profilePage.enterLastName(
                temporaryData.LastName
            );

            await profilePage.enterEmail(
                temporaryData.Email
            );

            await profilePage.enterPhone(
                temporaryData.Phone
            );

            await profilePage.enterAddress(
                temporaryData.Address
            );

            // Verify all temporary values were entered
            await expect(
                profilePage.getFirstNameInput()
            ).toHaveValue(temporaryData.FirstName);

            await expect(
                profilePage.getLastNameInput()
            ).toHaveValue(temporaryData.LastName);

            await expect(
                profilePage.getEmailInput()
            ).toHaveValue(temporaryData.Email);

            await expect(
                profilePage.getPhoneInput()
            ).toHaveValue(temporaryData.Phone);

            await expect(
                profilePage.getAddressInput()
            ).toHaveValue(temporaryData.Address);

            // Cancel without saving
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

            console.log(
                'All original Profile values were restored after Cancel'
            );
        }
    );

});