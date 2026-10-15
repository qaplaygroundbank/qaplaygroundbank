import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import ProfilePage from '../../pages/ProfilePage.js';
import ProfileTestData from '../../testData/ProfileTestData.json'
    with { type: 'json' };

test.describe.serial('Profile Tests', () => {
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
            await profilePage.verifyValidEmail(
                ProfileTestData.ValidData.Email
            );
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
            const alphabeticPhone = ProfileTestData.AlphabeticPhone.Phone;

            await profilePage.clickEditProfile();
            const originalPhone = await profilePage.getPhoneValue();

            console.log('Original Phone value:', originalPhone);
            await profilePage.enterPhone(alphabeticPhone);
            await expect(profilePage.getPhoneInput()).toHaveValue(alphabeticPhone);

            await profilePage.clickSaveChanges();
            await expect(profilePage.getPhoneValidationMessage()).toBeVisible();

            const phoneValidationMessage = await profilePage
                .getPhoneValidationMessage()
                .textContent();

            console.log('Phone validation message:', phoneValidationMessage);
            expect(phoneValidationMessage).toContain(
                'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
            );

            await expect(profilePage.getSaveChangesButton()).toBeVisible();
            await page.reload();
            await profilePage.clickEditProfile();
            await expect(profilePage.getPhoneInput()).toHaveValue(originalPhone);
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
});