//Author : Lalith KUmar
//Module : Apply Loan
//Requirment ID : LOAN-REQ-02

import { test, expect } from '../../fixtures/baseFixture.js';
import appConfig from '../../config/app.config.js';
import { LoanPage } from '../../pages/LoanPage.js';
import { VALIDATIONS } from '../../utils/constants.js';

test.describe('Loan Management', () => {
  test('LOAN-02 - Loan form displays all required controls @loan', async ({ page, loginPage }) => {
    const loanPage = new LoanPage(page);
    const environment = process.env.QA_PLAYGROUND_ENV || 'qa';
    const credentials = appConfig.getUiCredentials(environment);

    await loginPage.openLoginPage();
    await test.info().attach('Login Page', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    await loginPage.login(credentials.username, credentials.password);
    await test.info().attach('Login Filled', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    await expect(page).toHaveURL(VALIDATIONS.DASHBOARD_URL);
    await expect(loanPage.dashboardLink).toBeVisible();
    await test.info().attach('Dashboard', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    await loanPage.openFromDashboard();
    await loanPage.waitForLoaded();
    await test.info().attach('Apply Loan Page', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    await expect(loanPage.loanHeader).toBeVisible();
    await expect(loanPage.pageTitle).toHaveText('Apply for a Loan');

    await loanPage.openApplyLoanForm();
    await loanPage.validateApplyLoanForm();
    await test.info().attach('Loan Form Verified', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    await expect(loanPage.pageBody).not.toContainText(/error|loading/i);
    await test.info().attach('Final Check', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });
  });
});