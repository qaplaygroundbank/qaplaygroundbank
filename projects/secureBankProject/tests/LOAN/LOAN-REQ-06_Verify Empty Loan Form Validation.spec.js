//Module : Apply Loan
//Requirement ID : LOAN-REQ-06

import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import ApplyLoanPage from '../../pages/ApplyLoanPage.js';
import { VALIDATIONS } from '../../utils/constants.js';

test.describe('Loan Management', () => {
  test('LOAN-06 - Empty loan application is blocked with required field validation @loan', async ({ page, loginPage }) => {
    const applyLoanPage = new ApplyLoanPage(page);
    const environment = process.env.QA_PLAYGROUND_ENV || 'qa';
    const credentials = appConfig.getUiCredentials(environment);

    await loginPage.openLoginPage();
    await loginPage.login(credentials.username, credentials.password);
    await expect(page).toHaveURL(VALIDATIONS.DASHBOARD_URL);

    await page.getByRole('link', { name: /Apply for Loan/ }).click();
    await applyLoanPage.waitForLoaded();
    const existingApplications = await applyLoanPage.loanHistoryTable
      .locator('tbody tr')
      .allTextContents();

    await applyLoanPage.openApplyLoanForm();
    await applyLoanPage.validateApplyLoanForm();

    await expect(applyLoanPage.loanTypeDropdown).toContainText('Select loan type');
    await expect(applyLoanPage.loanAmountInput).toHaveValue('');
    await expect(applyLoanPage.accountDropdown).toContainText('Select account');
    await expect(applyLoanPage.purposeTextarea).toHaveValue('');

    await applyLoanPage.reviewBtn.click();

    await expect(applyLoanPage.loanDialog.getByRole('alert'))
      .toHaveText('Please select a loan type.');
    await expect(applyLoanPage.loanDialog).toBeVisible();
    await applyLoanPage.verifyControlsPresentAndEnabled();
    await expect(applyLoanPage.loanHistoryTable.locator('tbody tr'))
      .toHaveText(existingApplications);
    await expect(applyLoanPage.loanDialog).not.toContainText(/LOAN-\d{8}-\d+/);
  });
});
