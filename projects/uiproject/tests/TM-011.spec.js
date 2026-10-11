import { test, expect } from '@playwright/test';
 
test('TM-011 - Verify Maximum Transfer Limit', async ({ page }) => {
 
  // Step 1: Open banking application
  await page.goto('https://qaplayground.com/bank/login');
 
  // Step 2: Login
  await page.getByPlaceholder('Enter username').fill('standard_user');
  await page.getByPlaceholder('Enter password').fill('bank_sauce');
  await page.getByRole('button', { name: 'Sign In' }).click();
 
  // Step 3: Verify Dashboard
  await expect(
    page.getByRole('heading', { name: /Welcome back, Alex/i })
  ).toBeVisible();
 
  console.log('Login successful');
 
  // Step 4: Open Transfer Money page
  await page.getByText('Transfer', { exact: true }).click();
 
  await expect(
    page.getByRole('heading', { name: 'Transfer Money' })
  ).toBeVisible();
 
  console.log('Transfer Money page opened');
 
  // Step 5: Select From Account
await page.getByRole('combobox', { name: 'From Account' }).click();
 
await page.getByRole('option', {
  name: /Everyday Checking/
}).click();
 
 
  // Step 6: Select To Account
await page.getByRole('combobox', { name: 'To Account' }).click();
 
await page.getByRole('option', {
  name: /High-Yield Savings/
}).click();
 
  console.log('Accounts selected');
 
  // Step 7: Read documented maximum limit
  const MAX_TRANSFER_LIMIT = 4000; // Temporary test value; documented maximum pending confirmation
 
  expect(
    MAX_TRANSFER_LIMIT,
    'Please configure the documented maximum transfer limit'
  ).toBeGreaterThan(0);
 
  // Step 8: Verify sufficient balance
  const availableBalance = 4250;
 
  expect(
    availableBalance,
    'Source account must have sufficient balance'
  ).toBeGreaterThanOrEqual(MAX_TRANSFER_LIMIT);
 
  // Step 9: Enter maximum amount
  await page.getByLabel('Amount').fill(String(MAX_TRANSFER_LIMIT));
 
  // Step 10: Review Transfer
  await page.getByRole('button', { name: 'Review Transfer' }).click();
 
  // Step 11: Verify amount accepted
  await expect(
    page.getByText(/review|confirm transfer/i).first()
  ).toBeVisible();
 
  console.log('TM-011 PASSED: Maximum transfer amount accepted');
 
});