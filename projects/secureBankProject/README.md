# SecureBank UI Automation Project

This project contains Playwright browser tests for the QA Playground SecureBank application. It is executed through the repository's shared CLI and uses its own Playwright configuration, page objects, fixtures, selectors, and test data.

## Prerequisites and setup

Run these commands from the repository root:

```bash
npm ci
npx playwright install
npm run cli -- securebank --help
```

The UI project loads environment configuration from the root `.env` file when present. See the root [README](../../readme.md#configuration-and-secrets) for the complete variable list and secret-handling guidance.

## Running UI tests

All commands below run from the repository root.

Run the default smoke suite:

```bash
npm run cli -- securebank
```

Choose an environment and suite:

```bash
npm run cli -- securebank --env qa --suite smoke
npm run cli -- securebank --env qa --suite regression
```

Select a browser:

```bash
npm run cli -- securebank --env qa --suite regression --browser chromium
npm run cli -- securebank --env qa --suite regression --browser firefox
npm run cli -- securebank --env qa --suite regression --browser webkit
```

Run one test file. `--test-file` is relative to `projects/secureBankProject/`:

```bash
npm run cli -- securebank --env qa --suite regression --test-file tests/login/loginTest.spec.js
```

Show the browser while tests run:

```bash
npm run cli -- securebank --env qa --suite smoke --headed
```

Equivalent Makefile examples:

```bash
make securebank
make securebank ENV=qa SUITE=smoke
make securebank ENV=qa SUITE=regression BROWSER=chromium
make securebank TEST_FILE=tests/loginTest.spec.js
make securebank HEADED=true
```

### Suite filtering

The runner treats `regression` as all tests. Other suite values are interpreted as tags. For example, `--suite payments` selects tests marked with `@payments`. Multiple tags can be comma-separated:

```bash
npm run cli -- securebank --env qa --suite smoke,payments
```

Ensure the requested tags exist in the test files. A test without a matching tag may not be selected by a tag-filtered run.

## Environment configuration

The supported environment names are `qa`, `dev`, and `stage`.

| Environment | URL variable | Username variable | Password variable |
|---|---|---|---|
| QA | `UI_QA_LOGIN_URL` | `UI_QA_USERNAME` | `UI_QA_PASSWORD` |
| Dev | `UI_DEV_LOGIN_URL` | `UI_DEV_USERNAME` | `UI_DEV_PASSWORD` |
| Stage | `UI_STAGE_LOGIN_URL` | `UI_STAGE_USERNAME` | `UI_STAGE_PASSWORD` |

The QA URL defaults to `https://qaplayground.com/bank/login` when `UI_QA_LOGIN_URL` is not set. Dev and stage URLs must be supplied explicitly. Credentials are required wherever the test or configuration helper requests them.

Create a root `.env` file for local use and keep it out of version control. In GitHub Actions, configure secrets for credentials rather than committing them. The current manual workflow passes `UI_QA_USERNAME` and `UI_QA_PASSWORD` only for QA UI runs; dev and stage require workflow configuration before they are ready.

## Project layout

projects/secureBankProject/
├── cli.js                          # Registers the SecureBank CLI command
├── runner.js                       # Builds and launches the Playwright command
├── config/
│   ├── app.config.js               # Environment URLs and credentials
│   └── secureBankProject.config.js # SecureBank Playwright projects and reporter
├── testData/                       # SecureBank test data
├── fixtures/
│   └── baseFixture.js              # Shared fixtures and Page Object fixtures
├── pages/                          # Page Object classes
├── selectors/                      # Centralized selectors
├── tests/                          # Playwright test specifications
│   ├── login/
│   ├── billPay/
│   └── profile/
└── utils/                          # SecureBank-specific utilities
``


## Test implementation guidelines

- Keep test scenarios in `tests/`.
- Keep page-specific interactions in the relevant Page Object class under `pages/`.
- Reuse `fixtures/baseFixture.js` where its fixture contract fits the test.
- Keep reusable selectors in `selectors/` when centralization helps.
- Store reusable test data under `data/`.
- Use the shared logger from `commonlib/logger.js` rather than creating another project-specific logger.
- Prefer accessible Playwright locators such as `getByRole`, `getByLabel`, and `getByTestId` where appropriate.
- Keep assertions explicit and avoid changing test behavior as part of unrelated refactoring.

## Browser configuration and reports

The UI configuration defines Playwright projects for Chromium, Firefox, and WebKit. The runner selects one browser per invocation using `--browser`; run the command separately for each browser when cross-browser validation is required.

Each SecureBank test run generates Playwright HTML, Allure results, and an Excel workbook. For example, run only the transaction tests from the repository root:

```bash
npm run cli -- securebank --env qa --suite regression --browser chromium --test-file tests/transactions/moneyTransactionPage.spec.js
```

Generated report files are written to the repository root:

| Format | Output |
|---|---|
| Playwright HTML | `playwright-report/` |
| Allure raw results | `allure-results/` |
| Allure HTML | `allure-report/` |
| Excel execution report | `excel-report/securebank-test-execution-report.xlsx` |

Generate the Allure HTML dashboard after a test run:

```bash
npm run report:allure
```

Open the Playwright HTML report from the repository root:

```bash
npm run report
```

The Excel workbook is produced automatically at the end of each test run. Its `Execution Report` sheet uses a presentation-ready layout with run metadata, execution totals, pass rate, and a numbered test-case table showing expected result, actual result, and status.

Install an individual browser if needed:

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Troubleshooting

- If the application cannot be opened, check the URL for the selected environment.
- If login fails, verify the appropriate username and password environment variables.
- If no tests are found, verify the `--test-file` path and suite tag.
- If a browser executable is missing, install that browser with Playwright.
- If a test fails, inspect the terminal output and HTML report before changing locators or assertions.

For framework setup, CLI options, Git workflow, and GitHub Actions, see the [root README](../../readme.md).
