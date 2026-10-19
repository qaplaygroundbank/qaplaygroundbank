import {test, expect} from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import TransferPage from '../../pages/TransferPage.js';
import testData from '../../testData/TransferFundsData.json' assert { type: 'json' };

test.describe('TM-014 & TM-015 Test Case', () => {
    let transferPage;
    
    test.beforeEach(async ({ page }) => {

        const loginPage = new LoginPage(page);
        transferPage = new TransferPage(page);

        // 1. Navigate to the login page
        await loginPage.openLoginPage();

        // 2. Login
        await loginPage.login(
            process.env.UI_QA_USERNAME, 
            process.env.UI_QA_PASSWORD
        );

        // Verify successful login navigation to dashboard
        await expect(page).toHaveURL(/.*bank\/(dashboard|overview)?/);
        await transferPage.openTransferMoney();

        // 3. Navigate to the Transfer page via UI sidebar interaction
        await transferPage.clickTransferMenu();
        //await transferPage.openTransferPage();

        // Confirm the page initialization structural check
        await expect(transferPage.pageHeading).toBeVisible();
    });

    test('Decimal Precision Boundary Test', async({page}) =>{
        const data = testData.decimalPrecision;
        const expectedFormattedAmount = `$${Number(data.amount).toFixed(2)}`;
        

        // Step 3: Select To Account dropdown
        await transferPage.autoSelectAccounts();
        
        // Step 4: Enter Data
        await transferPage.fillTransferForm(data);

        // Step 5: Click Transfer Button
        await transferPage.clickReview();

        // Step 6: Confirm Transfer dialog
        await transferPage.confirmModalLoad();

        const modalAmountValue = await transferPage.getConfirmModalAmountText();

        expect(modalAmountValue).toBe(expectedFormattedAmount);

    });

    test('TM-015 -- Memo(Optional) Test', async({page}) =>{
        const data = testData.memoOptional;

        //Fill form 
        await transferPage.autoSelectAccounts();
        await transferPage.fillTransferForm(data);
        //await transferPage.memoInput.fill('');

        //Click review button
        await transferPage.clickReview();

        //Confirmation Page Load Verification
        await transferPage.confirmModalLoad();

        await expect(transferPage.confirmModalLocator).toBeVisible();
     });
     
});
