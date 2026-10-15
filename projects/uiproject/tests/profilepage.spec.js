//TC 01 Verify Profile page loads for authenticated user
import { test, expect } from '@playwright/test';
import { type } from 'node:os';
test('Verify Profile page loads for authenticated user', async ({ page }) => {
    await page.goto('https://qaplayground.com/bank');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('bank_sauce');
    await page.click('button[type="submit"]');
    //verify profile page is displayed
    await expect(page.getByText('Profile')).toBeVisible();
    await page.click('//span[text()="Profile"]');
    //Verify authunticated user to be vivible
    await expect(page.getByText('standard_user')).toBeVisible();
    await page.waitForTimeout(5000);
});

//TC 02 Profile displays existing customer information
test('Profile displays existing customer information', async ({ page }) => {
    await page.goto('https://qaplayground.com/bank');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('bank_sauce');
    await page.click('button[type="submit"]');

    await page.click('//span[text()="Profile"]');

    // Verify customer information is displayed
    await expect(page.getByText('standard_user')).toBeVisible();

    // Refresh page
    await page.reload();

    // Verify profile still loads
    await expect(page.getByText('Profile')).toBeVisible();
    await expect(page.getByText('standard_user')).toBeVisible();
});

// TC-03 Edit profile with valid data
test('Edit profile with valid data', async ({ page }) => {

    await page.goto('https://qaplayground.com/bank');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('bank_sauce');
    await page.click('button[type="submit"]');

    // Open Profile page
    await page.click('//span[text()="Profile"]');

    // Click Edit button
    await page.getByRole('button', { name: 'Edit' }).click();

    // Update First Name
    await page.getByLabel('First Name').fill('Mohan');

    // Save Changes
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify success message
    await expect(page.getByText(/success|updated/i)).toBeVisible();

    // Refresh page
    await page.reload();

    // Verify updated value persists
    await expect(page.getByText('Mohan')).toBeVisible();
});