import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import TransferPage from '../../pages/TransferPage';
import testData from '../../testData/TransferFundsData.json' with { type: 'json' };
  

test.describe('TM-014: TRANSFER MONEY - Boundary Precision Testing', () => {
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
        await expect(page).toHaveURL(/.*\/bank\/dashboard/);

        // 3. Navigate to the Transfer page via UI sidebar interaction
        await page.getByTestId('sidebar-link-transfer').click();
        await expect(page).toHaveURL(/.*\/bank\/transfer/);

        // Confirm the page initialization
        await expect(transferPage.pageHeading).toBeVisible();
    });

    test('TM-FR-03: Verify supported currency decimal precision is handled correctly', async ({ page }) => {
        const data = testData.decimalValuePrecision;

        const expectedFormattedAmount = `$${Number(data.amount).toFixed(2)}`;
        // Confirm transfer page
        const modalHeading = page.getByRole('heading', { name: 'Confirm Transfer' });
        const modalAmountValue = page.getByRole('dialog').getByText(expectedFormattedAmount);
        

        // Step 2: Select From Account dropdown 
        await transferPage.fromAccountSelect.click();
        await page.getByRole('option', { name: data.fromAccount, exact: false }).first().click();

        // Step 3: Select To Account dropdown
        await transferPage.toAccountSelect.click();
        await page.getByRole('option', { name: data.toAccount, exact: false }).first().click();

        // Step 4: Input the maximum decimal precision amount (e.g., "100.333")
        await transferPage.enterAmount(data.amount);

        // Step 5: Process form data to open the confirmation stage
        await transferPage.clickReviewTransfer();

        
        await expect(modalHeading).toBeVisible();

        
        // Verify correct round off -- Decimal precision (\$100.333 -> \$100.33)
        await expect(modalAmountValue).toHaveText(expectedFormattedAmount);


    });
});
