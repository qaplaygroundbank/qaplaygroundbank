import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';

// Verify the profile information displayed for the logged-in user
test('PROF-002 - Verify User Profile Information Is Displayed Correctly', async ({ page }) => {

    // Create LoginPage object
    const loginPage = new LoginPage(page);

    // Open login page
    await loginPage.openLoginPage();

    // Login using credentials from .env
    await loginPage.login(
        process.env.UI_QA_USERNAME,
        process.env.UI_QA_PASSWORD
    );

    // Verify successful login
    await expect(page).toHaveURL(/dashboard/);

    // Navigate to Profile page
    await page.getByTestId('sidebar-link-profile').click();

    // Verify Profile page URL
    await expect(page).toHaveURL(/profile/);

    // Verify Profile page title
    await expect(
        page.getByTestId('profile-page-title')
    ).toHaveText('Profile & Settings');

    // Verify username
    await expect(
        page.getByTestId('profile-username')
    ).toHaveText(process.env.UI_QA_USERNAME);

    // Verify first name
    await expect(
        page.getByTestId('profile-first-name')
    ).toHaveText('Alex');

    // Verify last name
    await expect(
        page.getByTestId('profile-last-name')
    ).toHaveText('Morgan');

    // Verify email address
    await expect(
        page.getByTestId('profile-email')
    ).toHaveText('alex.morgan@example.com');

    // Verify phone number
    await expect(
        page.getByTestId('profile-phone')
    ).toHaveText('(415) 555-0101');

    // Verify address
    await expect(
        page.getByTestId('profile-address')
    ).toHaveText('123 Market Street, San Francisco, CA 94105');
});