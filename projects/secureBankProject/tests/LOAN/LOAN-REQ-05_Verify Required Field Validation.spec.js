//Module : Apply Loan
//Requirement ID : LOAN-REQ-03

import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import ApplyLoanPage from '../../pages/ApplyLoanPage.js';
import { VALIDATIONS } from '../../utils/constants.js';

test.describe('Loan Management', () => {
  test('LOAN-03 - Missing loan purpose blocks application review @loan', async ({ page, loginPage }) => {
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

    await applyLoanPage.loanTypeDropdown.click();
    await page.getByRole('option', { name: 'Personal', exact: true }).click();
    await applyLoanPage.loanAmountInput.fill('5000');
    await applyLoanPage.accountDropdown.click();
    await page.getByRole('option', { name: /Everyday Checking/ }).click();

    await expect(applyLoanPage.loanTypeDropdown).toContainText('Personal');
    await expect(applyLoanPage.loanAmountInput).toHaveValue('5000');
    await expect(applyLoanPage.termLengthDropdown).toContainText('36');
    await expect(applyLoanPage.interestRateInput).toHaveValue('5.0');
    await expect(applyLoanPage.accountDropdown).not.toContainText('Select account');
    await expect(applyLoanPage.purposeTextarea).toHaveValue('');

    await applyLoanPage.reviewBtn.click();

    await expect(applyLoanPage.loanDialog.getByRole('alert'))
      .toHaveText('Please describe the purpose of the loan.');
    await expect(applyLoanPage.loanDialog).toBeVisible();
    await expect(applyLoanPage.purposeTextarea).toHaveValue('');
    await expect(
      applyLoanPage.loanHistoryTable.locator('tbody tr')
    ).toHaveText(existingApplications);
  });
});
