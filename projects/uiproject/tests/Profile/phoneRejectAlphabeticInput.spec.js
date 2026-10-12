import { test, expect } from '../../fixtures/baseFixture.js';

test.describe('Profile Phone Validation Tests', () => {

    test(
        'PROF-11: Verify alphabetic characters are rejected in the Phone field @smoke',
        async ({ page, loginPage }) => {

            // Step 1: Get credentials loaded from the local .env file
            const username = process.env.UI_QA_USERNAME;
            const password = process.env.UI_QA_PASSWORD;

            // Step 2: Verify that credentials are available
            expect(username).toBeTruthy();
            expect(password).toBeTruthy();

            // Step 3: Open the login page
            await loginPage.openLoginPage();

            // Step 4: Log in using the shared LoginPage method
            await loginPage.login(username, password);

            // Step 5: Verify successful login
            await expect(page).toHaveURL(/\/bank\/dashboard/);

            // Step 6: Open the Profile section
            await page
                .getByText('Profile', { exact: true })
                .click();

            // Step 7: Verify that the Profile page opened
            await expect(
                page.getByText('Profile & Settings', { exact: true })
            ).toBeVisible();

            // Step 8: Click the Edit button
            await page
                .getByTestId('edit-profile-btn')
                .click();

            // Step 9: Locate the Phone field
            const phoneField = page.getByTestId('profile-phone-input');

            // Step 10: Verify that the Phone field is editable
            await expect(phoneField).toBeVisible();
            await expect(phoneField).toBeEditable();

            // Step 11: Store the original phone number
            const originalPhone = await phoneField.inputValue();

            // Step 12: Enter alphabetic test data
            await phoneField.fill('abcdefghij');

            // Step 13: Verify that the test data was entered
            await expect(phoneField).toHaveValue('abcdefghij');

            // Step 14: Locate and click Save Changes
            const saveChangesButton = page.getByRole(
                'button',
                { name: 'Save Changes' }
            );

            await saveChangesButton.click();

            // Step 15: Verify the exact phone validation message
            await expect(
                page.getByText(
                    'Phone must be in format (XXX) XXX-XXXX or +1XXXXXXXXXX.'
                )
            ).toBeVisible();

            // Step 16: Verify that the form remains in Edit mode
            await expect(saveChangesButton).toBeVisible();

            // Step 17: Refresh the page to remove unsaved data
            await page.reload();

            // Step 18: Verify that the Profile returned to view mode
            await expect(
                page.getByTestId('edit-profile-btn')
            ).toBeVisible();

            // Step 19: Open Edit mode again
            await page
                .getByTestId('edit-profile-btn')
                .click();

            // Step 20: Verify that alphabetic data was not saved
            await expect(
                page.getByTestId('profile-phone-input')
            ).toHaveValue(originalPhone);

            // Step 21: Reload to leave the Profile in view mode
            await page.reload();

            // Step 22: Confirm the Profile is back in view mode
            await expect(
                page.getByTestId('edit-profile-btn')
            ).toBeVisible();
        }
    );

});