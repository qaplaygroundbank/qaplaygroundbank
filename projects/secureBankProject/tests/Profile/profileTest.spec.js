import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import ProfilePage from '../../pages/ProfilePage.js';
import ProfileTestData from '../../testData/ProfileTestData.json' with { type: 'json' };
import { VALIDATIONS } from '../../utils/constants.js';


test.describe('Profile', () => {
    let context;
    let page;
    let loginPage;
    let profilePage;

    // Setup browser session and login once before all Profile tests
    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);
        await loginPage.openLoginPage();
        await loginPage.login(process.env.UI_QA_USERNAME, process.env.UI_QA_PASSWORD);
        await profilePage.navigateToProfile();
    });

    // Verify valid email can be saved
    test('PROF-05 Verify a valid email can be entered/saved.', { tag: ['@smoke', '@profile'] }, async () => {
        await profilePage.verifyValidEmail(ProfileTestData.ValidData.Email);
    });

    // Verify invalid email is rejected
    test('PROF-06 Verify invalid email format is rejected.', { tag: ['@profile'] }, async () => {
        await profilePage.verifyInvalidEmail(ProfileTestData.InvalidEmailId.Email);
    });



    // PROF-003 - Verify valid profile changes can be saved.
    test('PROF-003 Verify valid profile changes can be saved.', { tag: ['@smoke', '@profile'] }, async ({ page }) => {
        -
        // Navigate to Profile page
        await profilePage.navigateToProfile();

        // Verify Profile page details
        await profilePage.verifyProfileUrl();
        await profilePage.verifyProfileTitle();

        //Click on EditProfilebutton
        await profilePage.tapOnEditProfileButton();
        await profilePage.updateMobileNumber(ProfileTestData.editProfile.phone);
        await profilePage.tapOnSaveProfileChanges();
        await profilePage.verifyProfileUpdateSuccessMessage(ProfileTestData.editProfile.successMessage);
        await profilePage.refeshPageAndValidateupdatedPhoneNumber(ProfileTestData.editProfile.phone);


    });

     // PROF-004 - Verify mandatory field validation.
    test('PROF-004 Verify mandatory field validation.', { tag: ['@profile'] }, async () => {
       
         // Navigate to Profile page
        await profilePage.navigateToProfile();

        // Verify Profile page details
        await profilePage.verifyProfileUrl();
        await profilePage.verifyProfileTitle();

        //Click on EditProfilebutton
        await profilePage.tapOnEditProfileButton();
        
        await profilePage.clearEmailField();
         
        await profilePage.tapOnSaveProfileChanges();
        await profilePage.verifyEmailErrorMessage(ProfileTestData.InvalidEmailId.EMailErrorMessage);
        await profilePage.saveChangebuttonIsEnabled();

    });

    // PROF-013 - Verify unsafe input cannot execute or corrupt UI.
    test('PROF-013 Verify unsafe input cannot execute or corrupt UI.', { tag: ['@profile'] }, async () => {
   
          // Navigate to Profile page
        await profilePage.navigateToProfile();

        // Verify Profile page details
        await profilePage.verifyProfileUrl();
        await profilePage.verifyProfileTitle();

        //Click on EditProfilebutton
        await profilePage.tapOnEditProfileButton();
        
        //Clear phone field and enter Script 
        await profilePage.clearPhoneField();
        await profilePage.enterPhoneNumber(ProfileTestData.htmlCode.scriptInput);
        await profilePage.tapOnSaveProfileChanges();
        await profilePage.verifyPhoneErrorMessage(ProfileTestData.editProfile.PhoneErrorMsg);
        
        await profilePage.clearPhoneField();
        await profilePage.enterPhoneNumber(ProfileTestData.editProfile.phone);
        await profilePage.clearEmailField();
        await profilePage.enterEmail(ProfileTestData.htmlCode.scriptInput);
        await profilePage.tapOnSaveProfileChanges();
        await profilePage.verifyEmailErrorMessage(ProfileTestData.InvalidEmailId.EMailErrorMessage);


    });




    // Logout and close browser session after all Profile tests
    test.afterAll(async () => {
        await loginPage.logout();
        await context.close();
    });




});