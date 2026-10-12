import { test } from '@playwright/test';
import { loginPage } from '../../pages/salesforce/loginPage';


test('Enter username', async ({ page }) => {

    await page.goto('https://login.salesforce.com/');

    const ss = new loginPage(page);
    
    await ss.enterUsername('testuser@gmail.com');
    
    await ss.clickLogin();

});