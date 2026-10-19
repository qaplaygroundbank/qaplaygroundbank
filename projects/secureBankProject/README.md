
# SecureBank UI Automation Project

## 1. Overview

The SecureBank UI Automation Project contains browser-based functional tests built with Playwright and JavaScript for the QA Playground SecureBank application.

The project is integrated with the repository's shared CLI, logging, configuration, and reporting utilities. It uses Page Objects, fixtures, centralized selectors, and reusable test data to keep test implementation consistent and maintainable.

### Key features

- Browser automation using Playwright.
- Support for Chromium, Firefox, and WebKit.
- Environment-based configuration for QA, Dev, and Stage.
- Smoke, regression, and tag-based test execution.
- Execution of individual test files.
- Headed and headless browser execution.
- HTML, Allure, and Excel reporting.
- Shared reporting utilities with the API automation project.

## 2. Prerequisites and Setup

Ensure the following software is installed:

- Node.js and npm.
- Git.
- Java, when generating or viewing Allure reports.
- A supported Playwright browser.

Run the following commands from the repository root:

```bash
npm ci
npx playwright install
npm run cli -- securebank --help
```

If you only need a specific browser, install it individually:

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

The project reads environment configuration from the repository's root `.env` file when present.

Refer to the [root README](../../readme.md#configuration-and-secrets) for shared framework setup, configuration, and secret-handling guidance.

## 3. Running UI Tests

All CLI commands in this section must be executed from the repository root.

### 3.1 Run the default smoke suite

```bash
npm run cli -- securebank
```

The default options are:

- Environment: `qa`
- Suite: `smoke`
- Browser: `chromium`
- Execution mode: headless
- Reporter: `html`

### 3.2 Select an environment and suite

Run the smoke suite:

```bash
npm run cli -- securebank --env qa --suite smoke
```

Run the regression suite:

```bash
npm run cli -- securebank --env qa --suite regression
```

The supported environment names are `qa`, `dev`, and `stage`.

### 3.3 Select a browser

Chromium:

```bash
npm run cli -- securebank --env qa --suite regression --browser chromium
```

Firefox:

```bash
npm run cli -- securebank --env qa --suite regression --browser firefox
```

WebKit:

```bash
npm run cli -- securebank --env qa --suite regression --browser webkit
```

The runner selects one browser per invocation. Run the command separately for each browser when cross-browser validation is required.

### 3.4 Run a specific test file

The `--test-file` path is relative to `projects/secureBankProject/`.

For example, run the login tests:

```bash
npm run cli -- securebank --env qa --suite regression --test-file tests/login/loginTest.spec.js
```

Run the bill payment tests:

```bash
npm run cli -- securebank --env qa --suite regression --test-file tests/billPay/submitBillPay.spec.js
```

Use the actual file name and path from the project when selecting an individual test file.

### 3.5 Run tests in headed mode

Use `--headed` to display the browser while tests execute:

```bash
npm run cli -- securebank --env qa --suite smoke --headed
```

### 3.6 Display available options

```bash
npm run cli -- securebank --help
```

## 4. Suite and Tag Filtering

The runner supports suite-based execution using tags in Playwright test titles or test annotations.

The `regression` suite is treated as the full test suite and does not apply a tag filter.

Other suite names are interpreted as tags. For example:

```bash
npm run cli -- securebank --env qa --suite smoke
```

Selects tests tagged with `@smoke`.

Multiple tags can be supplied as a comma-separated list:

```bash
npm run cli -- securebank --env qa --suite smoke,payments
```

This selects tests matching `@smoke` or `@payments`.

Ensure that the requested tags exist in the relevant test files. A test without a matching tag will not be selected by a tag-filtered execution.

When using `--test-file` with a non-regression suite, the tag filter still applies to that file.

## 5. Environment Configuration

The SecureBank project supports three environments:

| Environment | Login URL variable | Username variable | Password variable |
|---|---|---|---|
| QA | `UI_QA_LOGIN_URL` | `UI_QA_USERNAME` | `UI_QA_PASSWORD` |
| Dev | `UI_DEV_LOGIN_URL` | `UI_DEV_USERNAME` | `UI_DEV_PASSWORD` |
| Stage | `UI_STAGE_LOGIN_URL` | `UI_STAGE_USERNAME` | `UI_STAGE_PASSWORD` |

The QA login URL defaults to:

```text
https://qaplayground.com/bank/login
```

If `UI_QA_LOGIN_URL` is not configured, the default URL is used. Dev and Stage URLs must be configured explicitly.

### Local configuration

Create a `.env` file in the repository root and provide the variables required for your selected environment.

Example:

```dotenv
UI_QA_LOGIN_URL=https://qaplayground.com/bank/login
UI_QA_USERNAME=your_qa_username
UI_QA_PASSWORD=your_qa_password
```

Replace the example values with your actual configuration. Do not commit credentials or other secrets to version control.

For GitHub Actions, configure credentials as repository or environment secrets and expose them to the workflow as environment variables. Configure Dev and Stage variables in the workflow before running tests against those environments.

Refer to the root README for the complete configuration and secrets policy.

## 6. Reporting

The SecureBank project supports three report formats:

- **HTML:** Playwright's interactive test execution report.
- **Allure:** An interactive report with test results, execution details, and supporting information.
- **Excel:** A workbook containing a summary and detailed test results.

The selected reports are generated under:

```text
reports/securebank/<environment>/<suite>/
```

For example:

```text
reports/securebank/qa/smoke/
```

### 6.1 HTML report

HTML is the default reporter.

Run tests with HTML reporting:

```bash
npm run cli -- securebank --env qa --suite smoke --reporters html
```

Open the generated report:

```bash
npx playwright show-report reports/securebank/qa/smoke
```

The HTML report is generated in the selected environment and suite directory.

### 6.2 Allure report

Run tests with Allure reporting:

```bash
npm run cli -- securebank --env qa --suite smoke --reporters allure
```

The runner generates Allure result files and then creates the HTML report.

Expected output:

```text
reports/securebank/qa/smoke/
├── allure-results/
└── allure-report/
```

Open the report using:

```bash
npx allure open reports/securebank/qa/smoke/allure-report
```

Allure reporting requires the `allure-playwright` adapter and a working Java installation.

Use the Allure command to open the report rather than opening `index.html` directly from the file system.

### 6.3 Excel report

Run tests with Excel reporting:

```bash
npm run cli -- securebank --env qa --suite smoke --reporters excel
```

The generated workbook is:

```text
reports/securebank/qa/smoke/securebank-report.xlsx
```

The workbook contains two worksheets:

- **Summary:** Project, environment, suite, execution date, and test counts.
- **Test Results:** Test case, suite, status, duration, environment, and error message.

Playwright's JSON reporter is used internally to provide test results for the Excel workbook.

### 6.4 Generate multiple report formats

Select HTML and Allure:

```bash
npm run cli -- securebank --env qa --suite smoke --reporters html,allure
```

Select HTML and Excel:

```bash
npm run cli -- securebank --env qa --suite smoke --reporters html,excel
```

Generate all three formats:

```bash
npm run cli -- securebank --env qa --suite smoke --reporters html,allure,excel
```

The runner executes the tests once and generates the selected report formats from that execution.

### 6.5 Reporting options

| Option | Description |
|---|---|
| `html` | Generates the Playwright HTML report. |
| `allure` | Generates Allure results and an Allure HTML report. |
| `excel` | Generates the Excel workbook. |
| `html,allure` | Generates HTML and Allure reports. |
| `html,excel` | Generates HTML and Excel reports. |
| `html,allure,excel` | Generates all three report formats. |

If `--reporters` is omitted, HTML reporting is selected by default.

Reporter names are case-insensitive. Unsupported reporter names and empty selections are rejected by the shared reporting configuration.

### 6.6 Report directory structure

A typical run that generates all three report formats produces a directory similar to:

```text
reports/
└── securebank/
    └── qa/
        └── smoke/
            ├── index.html
            ├── allure-results/
            ├── allure-report/
            ├── playwright-results.json
            └── securebank-report.xlsx
```

The exact files present depend on the selected reporter formats.

Reports are generated for the selected environment and suite. Running the same environment and suite again may replace or refresh the corresponding report outputs.

## 7. Project Structure

```text
projects/secureBankProject/
├── cli.js
├── runner.js
├── config/
│   ├── app.config.js
│   └── secureBankProject.config.js
├── fixtures/
│   └── baseFixture.js
├── pages/
├── selectors/
├── testData/
├── tests/
│   ├── login/
│   ├── billPay/
│   ├── Profile/
│   └── accounts/
└── utils/
```

### Main components

| Component | Responsibility |
|---|---|
| `cli.js` | Registers the SecureBank CLI command and its options. |
| `runner.js` | Validates reporting configuration, builds the Playwright command, executes tests, and coordinates report generation. |
| `config/app.config.js` | Loads environment-specific application URLs and credentials. |
| `config/secureBankProject.config.js` | Defines Playwright settings, browser projects, and reporter configuration. |
| `fixtures/baseFixture.js` | Provides reusable test fixtures and Page Object fixtures. |
| `pages/` | Contains Page Object classes and page-specific interactions. |
| `selectors/` | Holds centralized selectors where reuse is appropriate. |
| `testData/` | Stores reusable test data. |
| `tests/` | Contains Playwright test specifications. |
| `utils/` | Contains SecureBank-specific helper utilities. |

Shared framework reporting and logging utilities are located under `commonlib/` at the repository root.

## 8. Test Implementation Guidelines

Follow these guidelines when adding or modifying tests:

- Keep test scenarios under `tests/`.
- Keep page-specific interactions in the appropriate Page Object class under `pages/`.
- Reuse `fixtures/baseFixture.js` where its fixture contract fits the test.
- Centralize reusable selectors under `selectors/` when it improves maintainability.
- Store reusable test data under `testData/`.
- Use the shared logger from `commonlib/logger.js` rather than creating another project-specific logger.
- Prefer accessible Playwright locators such as `getByRole()`, `getByLabel()`, and `getByTestId()` where appropriate.
- Keep assertions explicit and test intent clear.
- Avoid duplicating setup and teardown logic across tests.
- Do not change test behavior as part of unrelated refactoring.
- Use meaningful test names and appropriate suite tags.

## 9. Troubleshooting

### No tests found

Check that:

- The test file path is correct relative to `projects/secureBankProject/`.
- The requested suite tag exists in the selected test file.
- The selected environment and suite options are correct.

### Application cannot be opened

Check the URL configured for the selected environment and verify that the application is accessible.

### Login fails

Verify the appropriate username and password variables in the root `.env` file or the CI environment.

### Browser executable is missing

Install the required browser:

```bash
npx playwright install chromium
```

Replace `chromium` with `firefox` or `webkit` when required.

### HTML report cannot be opened

Generate the report by running the tests, then open it using:

```bash
npx playwright show-report reports/securebank/qa/smoke
```

Adjust the environment and suite path to match your execution.

### Allure report generation fails

Verify that Java is installed and available on `PATH`, and confirm that the Allure results directory was created by the test execution.

Use:

```bash
npx allure open reports/securebank/qa/smoke/allure-report
```

to preview a generated report.

### Excel report is missing

Confirm that `excel` was included in `--reporters` and inspect the terminal output for JSON parsing or workbook generation errors.

### Tests fail

Review the terminal output and generated report before changing locators, assertions, or test data. A test failure should remain visible in the execution result even when a report is generated successfully.

## 10. Related Documentation

For additional framework information, refer to the [root README](../../readme.md), which covers shared setup, configuration and secrets, CLI usage, Git workflow, and GitHub Actions.
