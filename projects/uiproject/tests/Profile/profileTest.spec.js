import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../pages/ProfilePage.js';

test('Check page load and title', async ({ page }) => {

    const profilePage = new ProfilePage(page);

});