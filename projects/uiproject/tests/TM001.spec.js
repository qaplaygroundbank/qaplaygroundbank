import { test, expect } from '@playwright/test';

test('TM-001 - Verify Transfer Money page opens with required controls @payments', async ({ page }) => {

  // Step 1: Open the banking application
  await page.goto('https://qaplayground.com/bank/login', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Step 2: Verify login page is displayed
  await expect(
    page.getByRole('heading', { name: 'SecureBank' })
  ).toBeVisible();

  // Step 3: Enter username
  await page.getByPlaceholder('Enter username').fill('standard_user');

  // Step 4: Enter password
  await page.getByPlaceholder('Enter password').fill('bank_sauce');

  // Step 5: Click Sign In
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Step 6: Verify dashboard is displayed
  await expect(
    page.getByRole('heading', { name: /Welcome back, Alex/i })
  ).toBeVisible({ timeout: 30000 });

  console.log('Login successful');
  console.log('Dashboard URL:', page.url());

  // Step 7: Click Transfer in the left navigation
  await page.getByText('Transfer', { exact: true }).click();

  // Step 8: Verify Transfer Money page is displayed
  await expect(
    page.getByRole('heading', { name: 'Transfer Money' })
  ).toBeVisible({ timeout: 30000 });

  console.log('Transfer Money page opened');

  // Step 9: Verify From Account
  await expect(
    page.getByText('From Account', { exact: true })
  ).toBeVisible();

  // Step 10: Verify To Account
  await expect(
    page.getByText('To Account', { exact: true })
  ).toBeVisible();

  // Step 11: Verify Amount
  await expect(
    page.getByText('Amount', { exact: true })
  ).toBeVisible();

  // Step 12: Verify Memo (optional)
  await expect(
    page.getByText('Memo (optional)', { exact: true })
  ).toBeVisible();

  // Step 13: Verify Transfer Date
  await expect(
    page.getByText('Transfer Date', { exact: true })
  ).toBeVisible();

  // Step 14: Verify Review Transfer button
  await expect(
    page.getByRole('button', { name: 'Review Transfer' })
  ).toBeVisible();

  // Step 15: Verify Cancel button
  await expect(
    page.getByRole('button', { name: 'Cancel' })
  ).toBeVisible();

  // Step 16: Test result
  console.log('TM-001 PASSED: All required controls are visible');
});
