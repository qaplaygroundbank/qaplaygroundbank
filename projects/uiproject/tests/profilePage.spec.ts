import { test, expect} from '@playwright/test';

const baseURL = 'https://qaplayground.com/bank/login';

// Test Case 1: Verify Page Loads Successfully and verify title.
test('Check page load and title', async ({ page }) => {
    await page.goto(baseURL);

    const actualTitle = 'QA Playground - Master Automation Testing';

    await expect(page).toHaveTitle(actualTitle);
});

// Test Case 2: Verify Entered Name
test.skip('verify the entered name', async ({ page }) => {
    await page.goto(baseURL);

    await page.locator('#name').fill('standard_user');

    await expect(page.locator('#name')).toHaveValue('standard_user');
});

// Test Case 3: Verify Profile opens successfully.
test('Verify Profile opens successfully', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByTestId('login-username-input').fill('standard_user');
    await page.getByTestId('login-password-input').fill('bank_sauce');
    await page.getByTestId('login-submit-btn').click();
    await page.getByTestId('sidebar-link-profile').click();
    //await page.getByTestId('profile-page-title').visible;

    await expect(page.getByTestId('profile-page-title')).toHaveText('Profile & Settings');

});
