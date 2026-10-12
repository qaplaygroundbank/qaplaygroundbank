import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Profile Email Validation Tests', () => {

    test(
        'PROF-07: Verify validation error when email domain is missing @smoke',
        async ({ page, loginPage }) => {

            // Step 1: Read login credentials loaded from the local .env file
            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            // Step 2: Confirm credentials are available before continuing
            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            // Step 3: Open the SecureBank login page
            await loginPage.openLoginPage();

            // Step 4: Log in using the shared LoginPage method
            await loginPage.login(username, password);

            // Step 5: Verify successful login
            await expect(page).toHaveURL(/\/bank\/dashboard/);

            // Step 6: Open the Profile section
            await page
                .getByText('Profile', { exact: true })
                .click();

            // Step 7: Verify the Profile page is displayed
            await expect(
                page.getByText('Profile & Settings', { exact: true })
            ).toBeVisible();

            // Step 8: Click the Edit button
            await page
                .getByTestId('edit-profile-btn')
                .click();

            // Step 9: Locate the Email field
            const emailField = page.getByLabel('Email');

            // Step 10: Confirm the Email field is editable
            await expect(emailField).toBeVisible();
            await expect(emailField).toBeEditable();

            // Step 11: Store the original email value
            const originalEmail = await emailField.inputValue();

            // Step 12: Enter an email with a missing domain
            await emailField.fill('admin@');

            // Step 13: Confirm the test value was entered
            await expect(emailField).toHaveValue('admin@');

            // Step 14: Click Save Changes
            const saveChangesButton = page.getByRole(
                'button',
                { name: 'Save Changes' }
            );

            await saveChangesButton.click();

            // Step 15: Read the browser-generated email validation message
            const validationMessage = await emailField.evaluate(
                element => element.validationMessage
            );

            // Step 16: Verify that an email validation message was generated
            expect(validationMessage).not.toBe('');

            // Step 17: Verify the form remains in Edit mode
            // This confirms the invalid email was not saved
            await expect(saveChangesButton).toBeVisible();

            // Step 18: Reload the page to remove unsaved invalid data
            await page.reload();

            // Step 19: Verify the Profile page returned to view mode
            await expect(
                page.getByTestId('edit-profile-btn')
            ).toBeVisible();

            // Step 20: Open Edit mode again
            await page
                .getByTestId('edit-profile-btn')
                .click();

            // Step 21: Verify the invalid email was not persisted
            await expect(
                page.getByLabel('Email')
            ).toHaveValue(originalEmail);

            // Step 22: Reload again to leave the Profile in view mode
            await page.reload();

            // Step 23: Confirm the Profile is in normal view mode
            await expect(
                page.getByTestId('edit-profile-btn')
            ).toBeVisible();
        }
    );

});