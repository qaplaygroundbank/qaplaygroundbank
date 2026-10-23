import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import ProfilePage from '../../pages/ProfilePage.js';
import ProfileTestData from '../../testData/ProfileTestData.json'
    with { type: 'json' };

test.describe('Profile Tests', () => {
    let loginPage;
    let profilePage;

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

    test(
        'PROF-05 Verify a valid Email can be entered and saved',
        { tag: ['@smoke', '@profile'] },
        async () => {
            const originalEmail = await profilePage.getEmailValue();

            try {
                await profilePage.verifyValidEmail(
                    ProfileTestData.ValidData.Email
                );
            } finally {
                await profilePage.restoreProfileField(
                    'email',
                    originalEmail
                );
            }
        }
    );

    test(
        'PROF-06 Verify invalid Email format is rejected',
        { tag: ['@smoke', '@profile'] },
        async () => {
            await profilePage.verifyInvalidEmail(
                ProfileTestData.InvalidEmailId.Email
            );
        }
    );

    test(
        'PROF-07 Verify Email with missing domain is rejected',
        { tag: ['@smoke', '@profile'] },
        async ({ page }) => {
            const testEmail = ProfileTestData.MissingDomainEmail.Email;

            await profilePage.clickEditProfile();
            const originalEmail = await profilePage.getEmailValue();

            await profilePage.enterEmail(testEmail);
            await expect(profilePage.getEmailInput()).toHaveValue(testEmail);

            await profilePage.clickSaveChanges();

            const validationMessage = await profilePage.getEmailValidationMessage();
            console.log('Email validation message:', validationMessage);
            expect(validationMessage).toContain('Please enter a valid email address.');

            await expect(profilePage.getSaveChangesButton()).toBeVisible();
            await page.reload();
            await profilePage.clickEditProfile();
            await expect(profilePage.getEmailInput()).toHaveValue(originalEmail);
        }
    );

    test(
        'PROF-11 Verify alphabetic characters are rejected in Phone field',
        { tag: ['@smoke', '@profile'] },
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

            // Enter alphabetic characters
            await profilePage.enterPhone(alphabeticPhone);

            // Verify the invalid test data was entered
            await expect(
                profilePage.getPhoneInput()
            ).toHaveValue(
                alphabeticPhone
            );

            // Attempt to save the invalid Phone value
            await profilePage.clickSaveChanges();

            // Verify the validation message is visible
            await expect(profilePage.getPhoneValidationMessage()).toBeVisible();

            // Read the actual validation message
            const phoneValidationMessage =
                await profilePage
                    .getPhoneValidationMessage()
                    .textContent();

            console.log(
                'Phone validation message:',
                phoneValidationMessage
            );

            // Verify the correct validation message
            expect(phoneValidationMessage).toContain(
                'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
            );

            // Verify Save was blocked and Edit mode remains open
            await expect(profilePage.getSaveChangesButton()).toBeVisible();

            // Reload to clear the invalid edit state
            await page.reload();

            // Verify the Profile returned to view mode
            await profilePage.verifyEditProfileButton();

            // Verify the old validation error is cleared
            await expect(profilePage.getPhoneValidationMessage()).toBeHidden();

            // Reopen Edit mode
            await profilePage.clickEditProfile();

            // Verify the invalid Phone value was not persisted
            await expect(
                profilePage.getPhoneInput()
            ).toHaveValue(
                originalPhone
            );

            // Verify the Phone field can be edited again
            await expect(
                profilePage.getPhoneInput()
            ).toBeEditable();

            // Read the Phone value after recovery
            const phoneAfterReload =
                await profilePage.getPhoneValue();

            console.log(
                'Phone value after reload:',
                phoneAfterReload
            );

            // Confirm that the original value remains
            expect(phoneAfterReload).toBe(
                originalPhone
            );
        }
    );

    test(
        'PROF-004 Verify mandatory field validation.',
        { tag: ['@profile'] },
        async () => {
            await profilePage.verifyProfileUrl();
            await profilePage.verifyProfileTitle();
            await profilePage.tapOnEditProfileButton();
            await profilePage.clearEmailField();
            await profilePage.tapOnSaveProfileChanges();
            await profilePage.verifyEmailErrorMessage(
                ProfileTestData.InvalidEmailId.EMailErrorMessage
            );
            await profilePage.saveChangebuttonIsEnabled();
        }
    );

    test(
        'PROF-022 Verify Profile remains usable across viewport sizes',
        {
            tag: ['@profile', '@boundary']
        },
        async ({ page }) => {
            const minimumViewport = {
                width:
                    ProfileTestData
                        .ResponsiveViewports
                        .Minimum
                        .Width,
                height:
                    ProfileTestData
                        .ResponsiveViewports
                        .Minimum
                        .Height
            };

            const desktopViewport = {
                width:
                    ProfileTestData
                        .ResponsiveViewports
                        .Desktop
                        .Width,
                height:
                    ProfileTestData
                        .ResponsiveViewports
                        .Desktop
                        .Height
            };

            const viewportSizes = [
                minimumViewport,
                desktopViewport
            ];

            for (const viewport of viewportSizes) {
                await page.setViewportSize(viewport);

                expect(page.viewportSize()).toEqual(viewport);

                await profilePage.verifyNoHorizontalOverflow(
                    viewport.width
                );

                await profilePage.verifyProfileNavigationAtViewport(
                    viewport.width
                );

                await profilePage.verifyProfileViewAtViewport(
                    viewport.width
                );

                await profilePage.clickEditProfile();

                await profilePage.verifyProfileEditControlsAtViewport(
                    viewport.width
                );

                await profilePage.clickCancelEditProfile();
                await profilePage.verifyEditProfileButton();
            }
        }
    );

    test(
        'PROF-013 Verify unsafe input cannot execute or corrupt UI.',
        { tag: ['@profile'] },
        async () => {
            await profilePage.verifyProfileUrl();
            await profilePage.verifyProfileTitle();
            await profilePage.tapOnEditProfileButton();

            await profilePage.clearPhoneField();
            await profilePage.enterPhoneNumber(
                ProfileTestData.htmlCode.scriptInput
            );
            await profilePage.tapOnSaveProfileChanges();
            await profilePage.verifyPhoneErrorMessage(
                ProfileTestData.editProfile.PhoneErrorMsg
            );

            await profilePage.clearPhoneField();
            await profilePage.enterPhoneNumber(
                ProfileTestData.editProfile.phone
            );
            await profilePage.clearEmailField();
            await profilePage.enterEmail(
                ProfileTestData.htmlCode.scriptInput
            );
            await profilePage.tapOnSaveProfileChanges();
            await profilePage.verifyEmailErrorMessage(
                ProfileTestData.InvalidEmailId.EMailErrorMessage
            );
        }
    );

    test(
        'PROF-15 Verify Cancel discards unsaved Profile changes',
        { tag: ['@smoke', '@profile'] },
        async () => {
            const temporaryData = ProfileTestData.TemporaryProfileData;

            await profilePage.clickEditProfile();

            const originalFirstName = await profilePage.getFirstNameValue();
            const originalLastName = await profilePage.getLastNameValue();
            const originalEmail = await profilePage.getEmailValue();
            const originalPhone = await profilePage.getPhoneValue();
            const originalAddress = await profilePage.getAddressValue();

            await profilePage.enterFirstName(temporaryData.FirstName);
            await profilePage.enterLastName(temporaryData.LastName);
            await profilePage.enterEmail(temporaryData.Email);
            await profilePage.enterPhone(temporaryData.Phone);
            await profilePage.enterAddress(temporaryData.Address);

            await expect(profilePage.getFirstNameInput()).toHaveValue(temporaryData.FirstName);
            await expect(profilePage.getLastNameInput()).toHaveValue(temporaryData.LastName);
            await expect(profilePage.getEmailInput()).toHaveValue(temporaryData.Email);
            await expect(profilePage.getPhoneInput()).toHaveValue(temporaryData.Phone);
            await expect(profilePage.getAddressInput()).toHaveValue(temporaryData.Address);

            await profilePage.clickCancelEditProfile();
            await profilePage.verifyEditProfileButton();
            await profilePage.clickEditProfile();

            await expect(profilePage.getFirstNameInput()).toHaveValue(originalFirstName);
            await expect(profilePage.getLastNameInput()).toHaveValue(originalLastName);
            await expect(profilePage.getEmailInput()).toHaveValue(originalEmail);
            await expect(profilePage.getPhoneInput()).toHaveValue(originalPhone);
            await expect(profilePage.getAddressInput()).toHaveValue(originalAddress);
        }
    );

    test(
        'PROF-003 Verify valid profile changes can be saved',
        { tag: ['@smoke', '@profile'] },
        async () => {
            const originalPhone = await profilePage.getPhoneValue();

            try {
                await profilePage.verifyProfileUrl();
                await profilePage.verifyProfileTitle();
                await profilePage.tapOnEditProfileButton();
                await profilePage.updateMobileNumber(
                    ProfileTestData.editProfile.phone
                );
                await profilePage.tapOnSaveProfileChanges();
                await profilePage.verifyProfileUpdateSuccessMessage(
                    ProfileTestData.editProfile.successMessage
                );
                await profilePage.refreshPageAndValidateUpdatedPhoneNumber(
                    ProfileTestData.editProfile.phone
                );
            } finally {
                await profilePage.restoreProfileField(
                    'phone',
                    originalPhone
                );
            }
        }
    );
});
