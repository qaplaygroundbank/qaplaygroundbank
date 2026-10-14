import { test, expect } from '@playwright/test';

test('Sample Test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});