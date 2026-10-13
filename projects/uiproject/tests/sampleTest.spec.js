import { test, expect } from '@playwright/test';

const baseURL = 'https://testautomationpractice.blogspot.com/';

// Test Case 1: Verify Page Loads Successfully and verify title.
test('Check page load and title @smoke', async ({ page }) => {
    await page.goto(baseURL);

    const actualTitle = 'Automation Testing Practice';

    await expect(page).toHaveTitle(actualTitle);
});

// Test Case 2: Verify Entered Name
test('verify the entered name @forms', async ({ page }) => {
    await page.goto(baseURL);

    await page.locator('#name').fill('Niranjan');

    await expect(page.locator('#name')).toHaveValue('Niranjan');
});

// Test Case 3: Verify Gender Selection
test('Verify the Male Gender Selection @forms', async ({ page }) => {
    await page.goto(baseURL);

    await page.locator('#male').check();

    await expect(page.locator('#male')).toBeChecked();
    await expect(page.locator('#female')).not.toBeChecked();
});

// Test Case 4: Select Multiple Days
test('Select multiple days @forms', async ({ page }) => {
    await page.goto(baseURL);

    await page.locator('#sunday').check();
    await page.locator('#wednesday').check();
    await page.locator('#friday').check();

    await expect(page.locator('#sunday')).toBeChecked();
    await expect(page.locator('#wednesday')).toBeChecked();
    await expect(page.locator('#friday')).toBeChecked();
});
