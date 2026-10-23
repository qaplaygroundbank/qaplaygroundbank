# ANZ Commercial CRM Demo Project

This is a separate Playwright project for a local ANZ-themed commercial CRM
demo. It does not connect to an ANZ system and uses fictional customer data
only. The local HTML fixture makes the tests repeatable and independent from
external services.

## Environment settings

The project loads settings from `projects/anzProject/.env`. The local file is
ignored by Git; use `.env.example` as the template when setting up another
workspace. `ANZ_TEST_HOLD_MS` controls how long each test page remains open
after a test, and `ANZ_SLOW_MO_MS` controls the delay between browser actions.
Both default to `5000` and `0` milliseconds respectively.

## Run from the repository root

```bash
npm run cli -- anz --help
npm run cli -- anz --suite smoke
npm run cli -- anz --suite regression --browser chromium
npm run cli -- anz --suite regression --test-file tests/commercialCrm.spec.js
npm run cli -- anz --suite regression --headed --hold 10000
```

The project supports Chromium, Firefox, and WebKit. Suite names other than
`regression` select test tags; the CRM tests are marked `@smoke` and `@crm`.
`--hold` keeps each page open for the specified milliseconds after a test
finishes (default: `5000`), making headed executions easier to watch.
Each test title includes a category label (`@positive`, `@negative`, or
`@boundary`), so the category is visible in Playwright output and can be
selected independently, for example:

```bash
npm run cli -- anz --suite positive
npm run cli -- anz --suite negative
npm run cli -- anz --suite boundary
```

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

The tests include explicitly labeled positive, negative, and boundary cases
for the customer directory, search, segment filtering, record details, and
empty states.
