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

    // PROF-001 - Verify User Can Successfully Access The Profile Page
    test('PROF-001 Verify User Can Successfully Access The Profile Page', { tag: ['@profile'] }, async () => {

        await profilePage.verifyProfileUrl();
        await profilePage.verifyProfilePageVisible();
        await profilePage.verifyProfileTitle();
        await profilePage.verifyPersonalInfoSection();
        await profilePage.verifyEditProfileButton();

    });

    // PROF-002 - Verify User Profile Information Is Displayed Correctly
    test('PROF-002 Verify User Profile Information Is Displayed Correctly', { tag: ['@profile'] }, async () => {

        await profilePage.verifyProfileUrl();
        await profilePage.verifyProfileTitle();
        await profilePage.verifyUsername(process.env.UI_QA_USERNAME);
        await profilePage.verifyFirstName(ProfileTestData.ValidData.FirstName);
        await profilePage.verifyLastName(ProfileTestData.ValidData.LastName);
        await profilePage.verifyProfileEmail(ProfileTestData.ValidData.Email);
        await profilePage.verifyPhone(ProfileTestData.ValidData.Phone);
        await profilePage.verifyAddress(ProfileTestData.ValidData.Address);

    });

    // PROF-012 - Verify Phone Boundary Length Validation
    test('PROF-012 Verify Phone Boundary Length Is Validated', { tag: ['@profile'] }, async () => {

        await profilePage.clickEditProfile();
        await profilePage.enterPhone(ProfileTestData.PhoneData.AboveMaxPhone);
        await profilePage.clickSaveProfile();
        await profilePage.verifyPhoneValidationMessage();
        await profilePage.enterPhone(ProfileTestData.PhoneData.ValidPhone);
        await profilePage.verifyPhoneValue(ProfileTestData.PhoneData.ValidPhone);

    });

    // PROF-003 - Verify valid profile changes can be saved.
    test('PROF-003 Verify valid profile changes can be saved.', { tag: ['@smoke', '@profile'] }, async ({ page }) => {
    
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

    // PROF-019 - Verify over-limit phone number is rejected.
    test('PROF-019 Verify over-limit phone number is rejected.', { tag: ['@profile'] }, async () => {
        await profilePage.navigateToProfile();
        await profilePage.verifyProfileUrl();
        await profilePage.verifyProfileTitle();

        await profilePage.tapOnEditProfileButton();
        await profilePage.enterPhone(ProfileTestData.PhoneData.AboveMaxPhone);
        await profilePage.tapOnSaveProfileChanges();

        await profilePage.verifyPhoneValidationMessage();

    });

        // PROF-020 - Verify profile data is displayed for the correct user.
    test('PROF-020 Verify profile data is displayed for the correct user.', { tag: ['@profile'] }, async ({ browser }) => {

        const userAContext = await browser.newContext();
        const userAPage = await userAContext.newPage();

        const userALoginPage = new LoginPage(userAPage);
        const userAProfilePage = new ProfilePage(userAPage);

        await userALoginPage.openLoginPage();
        await userALoginPage.login(process.env.UI_QA_USERNAME,process.env.UI_QA_PASSWORD);

        await userAProfilePage.navigateToProfile();
        await userAProfilePage.tapOnEditProfileButton();
        await userAProfilePage.updateMobileNumber(ProfileTestData.editProfile.phone);
        await userAProfilePage.tapOnSaveProfileChanges();
        await userAProfilePage.verifyProfileUpdateSuccessMessage(ProfileTestData.editProfile.successMessage);

        await userALoginPage.logout();
        await userAContext.close();

        const userBContext = await browser.newContext();
        const userBPage = await userBContext.newPage();

        const userBLoginPage = new LoginPage(userBPage);
        const userBProfilePage = new ProfilePage(userBPage);

        await userBLoginPage.openLoginPage();
        await userBLoginPage.login(process.env.UI_QA_USERNAME_2,process.env.UI_QA_PASSWORD_2);

        await userBProfilePage.navigateToProfile();
        await userBProfilePage.verifyPhoneIsNotDisplayed(ProfileTestData.editProfile.phone);

        await userBLoginPage.logout();
        await userBContext.close();

    });

    // Logout and close browser session after all Profile tests
    test.afterAll(async () => {
        await loginPage.logout();
        await context.close();
    });




});