//Author : Lalith KUmar
//Module : Apply Loan
//Requirment ID : LOAN-REQ-02

import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import ApplyLoanPage from '../../pages/ApplyLoanPage.js';
import { VALIDATIONS } from '../../utils/constants.js';
import applyLoanData from '../../testData/applyLoanData.json' with { type: 'json' };
import { attachScreenshot } from '../../utils/commonTestUtils.js';

test.describe('Loan Management', () => {
  test('LOAN-02 - Loan form displays all required controls @loan', async ({ page, loginPage }) => {
    const applyLoanPage = new ApplyLoanPage(page);
    const environment = process.env.QA_PLAYGROUND_ENV || 'qa';
    const credentials = appConfig.getUiCredentials(environment);

    await loginPage.openLoginPage();
    await attachScreenshot(test.info(), page, 'Login Page');

    await loginPage.login(credentials.username, credentials.password);
    await attachScreenshot(test.info(), page, 'Login Filled');

    await expect(page).toHaveURL(VALIDATIONS.DASHBOARD_URL);
    await expect(applyLoanPage.dashboardLink).toBeVisible();
    await attachScreenshot(test.info(), page, 'Dashboard');

    await applyLoanPage.openFromDashboard();
    await applyLoanPage.waitForLoaded();
    await attachScreenshot(test.info(), page, 'Apply Loan Page');

    await expect(applyLoanPage.loanHeader).toBeVisible();
    await expect(applyLoanPage.pageTitle).toHaveText(applyLoanData.pageTitle);

    await applyLoanPage.openApplyLoanForm();
    await applyLoanPage.validateApplyLoanForm();
    await attachScreenshot(test.info(), page, 'Loan Form Verified');

    await expect(applyLoanPage.pageBody).not.toContainText(/error|loading/i);
    await attachScreenshot(test.info(), page, 'Final Check');
  });
});