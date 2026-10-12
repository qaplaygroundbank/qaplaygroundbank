import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';

// Verify user can successfully navigate to the Profile page
test('PROF-001 - Verify User Can Successfully Access The Profile Page', async ({ page }) => {

    // Create LoginPage object
    const loginPage = new LoginPage(page);

    // Open application login page
    await loginPage.openLoginPage();

    // Login using credentials from .env file
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

    // Verify Profile page is displayed
    await expect(
        page.getByTestId('profile-page')
    ).toBeVisible();

    // Verify page title
    await expect(
        page.getByTestId('profile-page-title')
    ).toHaveText('Profile & Settings');

    // Verify Personal Information section
    await expect(
        page.getByTestId('personal-info-section')
    ).toBeVisible();

    // Verify Edit Profile button is visible
    await expect(
        page.getByTestId('edit-profile-btn')
    ).toBeVisible();

    // Verify Edit Profile button is enabled
    await expect(
        page.getByTestId('edit-profile-btn')
    ).toBeEnabled();
});