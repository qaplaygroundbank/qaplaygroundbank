# ANZ Commercial CRM Demo Project

This is a separate Playwright project for a local ANZ-themed commercial CRM
demo. It does not connect to an ANZ system and uses fictional customer data
only. The local HTML fixture makes the tests repeatable and independent from
external services.

## Run from the repository root

```bash
npm run cli -- anz --help
npm run cli -- anz --suite smoke
npm run cli -- anz --suite regression --browser chromium
npm run cli -- anz --suite regression --test-file tests/commercialCrm.spec.js
```

The project supports Chromium, Firefox, and WebKit. Suite names other than
`regression` select test tags; the CRM tests are marked `@smoke` and `@crm`.

## Project layout

```text
projects/anzProject/
├── cli.js
├── runner.js
├── config/anzProject.config.js
├── fixtures/baseFixture.js
├── pages/
│   ├── BasePage.js
│   └── CommercialCrmPage.js
├── selectors/commercialCrmSelectors.js
├── testData/
│   ├── commercialCrmData.json
│   └── commercialCrmDemo.html
├── tests/commercialCrm.spec.js
└── utils/locatorResolver.js
```

The tests cover the customer directory, search by business name or customer ID,
segment filtering, record details, and the no-results state.
