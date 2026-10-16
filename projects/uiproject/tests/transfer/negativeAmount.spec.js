import { test, expect } from '../../fixtures/baseFixture.js';

import appConfig from '../../config/app.config.js';

import transferData
  from '../../testData/TransferFundsData.json'
  with { type: 'json' };

import errorMessages
  from '../../testData/errorMessage.json'
  with { type: 'json' };

import LoginPage from '../../pages/LoginPage.js';
import TransferPage from '../../pages/TransferPage.js';

test.describe('Transfer form validation', () => {
    let loginPage;
    let transferPage;
  test.beforeEach(
    async ({ page }) => {

     loginPage = new LoginPage(page);
    transferPage = new TransferPage(page);

    await loginPage.openLoginPage();

    const username = process.env.UI_QA_USERNAME;
    const password = process.env.UI_QA_PASSWORD;

    await expect(username, 'UI_QA_USERNAME is not configured').toBeTruthy();
    await  expect(password, 'UI_QA_PASSWORD is not configured').toBeTruthy();

    await loginPage.login(username, password);

      await transferPage.navigateToTransfer();
    }
  );

  test(
    'TM_UI_009: Validate Negative amount',
    async ({ transferPage }) => {

      await transferPage.validateAmountPlaceholder(
        transferData.uiValidation.amountPlaceholder
      );

    }
  );

  for (const scenario of transferData.negativeScenarios) {

    test(
      `${scenario.testId}: ${scenario.description}`,
      async ({ transferPage }) => {

        const expectedError =
          errorMessages.transfer[
          scenario.expectedErrorKey
          ];

        expect(
          expectedError,
          `Missing error-message mapping for ${scenario.expectedErrorKey}`
        ).toBeDefined();

        await test.step(
          'Populate transfer form',
          async () => {
            await transferPage.fillTransferForm(
              scenario.formData
            );
          }
        );

        await test.step(
          'Submit transfer',
          async () => {
            await transferPage.clickReviewTransfer();
          }
        );

        await test.step(
          'Validate error message',
          async () => {
            await transferPage.validateErrorMessage(
              expectedError
            );
          }
        );
      }
    );
  }
});