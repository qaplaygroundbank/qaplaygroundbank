
import 'dotenv/config';
import { test, expect } from '@playwright/test';

async function login(page) {

    const username = process.env.BANK_USERNAME;
    const password = process.env.BANK_PASSWORD;
    await page.goto('https://qaplayground.com/bank');

    await page.getByPlaceholder('Enter username').fill(username);
    await page.getByPlaceholder('Enter password').fill(password);

    await page.getByRole('button', {name : 'Sign In'}).click();
}

test('Create Account Type As Credit', async({ page }) => {


    await login(page);

    //await page.pause();
    await page.getByTestId('sidebar-link-accounts').click();

    await page.getByTestId('add-account-btn').click();

    await page.getByTestId('account-form-name-input').fill('Credit Account');

    await page.getByTestId('account-form-type-select').click();

    const options = await page.getByTestId('account-form-type-option').allTextContents();
    console.log(options);

    const accountType = 'Credit'; //[ 'Checking', 'Savings', 'Credit' ]
    const option = page.getByRole('option', { name: accountType});

    await expect(option).toBeVisible();
    await option.click();

    await page.locator('input[name="account_balance_field"]').fill('500');

    await page.getByTestId('account-form-accept-terms-checkbox').check();
    await page.getByTestId('save-account-form-btn').click();

    await page.getByTestId('add-account-btn').click();

    await page.getByTestId('account-form-name-input').fill('Savings Account');

    await page.getByTestId('account-form-type-select').click();

    //const options = await page.getByTestId('account-form-type-option').allTextContents();
    //console.log(options);

    const accountType2 = 'Savings'; //[ 'Checking', 'Savings', 'Credit' ]
    const option2= page.getByRole('option', { name: accountType2});

    await expect(option2).toBeVisible();
    await option2.click();

    await page.locator('input[name="account_balance_field"]').fill('5000');

    await page.getByTestId('account-form-accept-terms-checkbox').check();
    await page.getByTestId('save-account-form-btn').click();

    //to Click on the Transfer link to transfer funds from one account to another
    await page.getByTestId('sidebar-link-transfer').click();
    

    await page.getByTestId('transfer-from-select').click();

    await page.getByTestId('transfer-from-option').filter({ hasText: 'Credit Account' }).click();

    await page.getByTestId('transfer-to-select').click();

    await page.getByTestId('transfer-to-option').filter({hasText: 'Savings Account'}).click();
    await page.getByTestId('transfer-amount-input').fill('200'); //transfer-amount-input

    await page.getByTestId('review-transfer-btn').click();
    
    await page.getByTestId('confirm-transfer-btn').click();

    //await page.pause();

    await expect(page.getByTestId('transfer-success-heading')).toHaveText('Transfer Successful');

});

/*
test('Create Account Type As Savings',async( { page}) => {

    await login(page);

    await page.getByTestId('add-account-btn').click();

    await page.getByTestId('account-form-name-input').fill('Savings Account');

    await page.getByTestId('account-form-type-select').click();

    const options = await page.getByTestId('account-form-type-option').allTextContents();
    console.log(options);

    const accountType = 'Savings'; //[ 'Checking', 'Savings', 'Credit' ]
    const option = page.getByRole('option', { name: accountType});

}); */