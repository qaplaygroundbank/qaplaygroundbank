import { test, expect } from '@playwright/test';

test('PROF003 - Verify valid profile changes can be saved', async ({ page }) => {

  // Open the banking application
  await page.goto('https://qaplayground.com/bank/login', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Verify login page is displayed
  await expect(
    page.getByRole('heading', { name: 'SecureBank' })
  ).toBeVisible();

  // Enter username ,Enter Password & Click Sign In
  await page.getByPlaceholder('Enter username').fill('standard_user');
  await page.getByPlaceholder('Enter password').fill('bank_sauce');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Step 6: Verify dashboard is displayed
  await expect(
    page.getByRole('heading', { name: /Welcome back, Alex/i })
  ).toBeVisible({ timeout: 30000 });

  console.log('Login successful');
  console.log('Dashboard URL:', page.url());

  // step to click on Profile & navigated on profile page
  await page.getByTestId('sidebar-link-profile').click();
  await expect(page).toHaveURL(/.*\/profile/);

  

  //Tap on editButton
  await expect(page.getByTestId('edit-profile-btn')).toBeVisible();
  await page.getByTestId('edit-profile-btn').click();
  await page.waitForTimeout(2000);

  // Edit phone number
  const phoneInput = page.getByTestId('profile-phone-input');
  const oldPhoneNumber = await phoneInput.inputValue();
  console.log('Old Phone Number:', oldPhoneNumber);

  // Enter new phone number
  const newPhoneNumber = '(987) 654-3210';

  // Clear existing value and enter newnumber
  await phoneInput.clear();
  await phoneInput.fill(newPhoneNumber);

  // Verify new value is entered
  await expect(phoneInput).toHaveValue(newPhoneNumber);

  console.log('New Phone Number:', newPhoneNumber);

  await page.waitForTimeout(2000);

  await expect(page.getByTestId('save-profile-btn')).toBeVisible();
  await page.getByTestId('save-profile-btn').click();


  // Success message locator

  const successMsg = page.getByTestId('profile-save-success');
  console.log("SuccessText" + successMsg);

  await expect(successMsg).toHaveText('Profile updated successfully.');
  await expect(successMsg).toHaveText('Profile updated successfully.');

  // Verify it disappears after a few seconds
  await expect(successMsg).toBeHidden({ timeout: 7000 });

  //reload the page and validate phonenumber is updated.
  await page.reload();
  await page.waitForTimeout(2000);

  const phoneNumber = await page.getByTestId('profile-phone').textContent();
  expect(phoneNumber).toBe(newPhoneNumber);
  console.log('Expected:', newPhoneNumber);
  console.log('Actual:', phoneNumber);

});