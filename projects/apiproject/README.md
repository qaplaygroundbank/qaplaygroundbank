
# API Automation Project

The API Automation Project is part of the QA Playground Bank automation framework. It uses Mocha, Chai, and SuperTest to execute API tests, with a shared CLI for test execution and configurable reporting.

## Features

- API testing using SuperTest and Chai.
- Reusable API clients and Page Object Model-style organization for API operations.
- Environment selection using `--env`.
- Suite selection using `--suite`.
- Tag-based test filtering for smoke, regression, and negative suites.
- Multiple reporting formats: HTML, Allure, and Excel.
- Shared logging and reporting configuration.
- Exit codes that indicate test execution success or failure.

## Prerequisites

- Node.js and npm.
- Dependencies installed from the repository root.
- Java runtime available for the classic Allure CLI.
- A terminal for executing commands.

Check your installation:

```bash
node --version
npm --version
java -version
```

Java is required when generating or serving the Allure HTML report with the classic Allure CLI.

## Installation

Run the following commands from the repository root:

```bash
npm install
npm run cli -- --help
npm run cli -- api --help
```

If you have already installed the project dependencies with `npm ci`, you do not need to run `npm install` again.

## Running API Tests

All API tests are executed through the shared framework CLI.

### Run the default configuration

```bash
npm run cli -- api
```

By default, the command uses:

- Environment: `qa`
- Suite: `smoke`
- Reporter: `html`

### Select an environment and suite

```bash
npm run cli -- api --env qa --suite smoke
npm run cli -- api --env dev --suite regression
npm run cli -- api --env qa --suite negative
```

Available suites:

| Suite | Description |
|---|---|
| `smoke` | Executes critical tests tagged `@smoke`. |
| `regression` | Executes tests tagged `@regression`. |
| `negative` | Executes tests tagged `@negative`. |

Tests can have more than one tag. For example, a test tagged `@smoke @regression` is included in both suites.

The API runner discovers `.test.js` files under the project's `tests/` directory and applies the selected tag filter.

## Reporting

The API project supports three reporting formats:

- HTML — generated using Mochawesome.
- Allure — test results and a browsable Allure HTML report.
- Excel — an `.xlsx` workbook containing a summary and detailed test results.

The default reporter is `html` when `--reporters` is omitted.

### HTML report

Generate the default HTML report:

```bash
npm run cli -- api --suite smoke
```

Or explicitly select HTML:

```bash
npm run cli -- api --suite smoke --reporters html
```

Output:

```text
reports/api/qa/smoke/api-report.html
```

Open the report on macOS:

```bash
open reports/api/qa/smoke/api-report.html
```

### Allure report

Generate only the Allure report:

```bash
npm run cli -- api --suite smoke --reporters allure
```

The runner generates Allure result files and the browsable HTML report.

Output structure:

```text
reports/api/qa/smoke/
├── allure-results/
└── allure-report/
    └── index.html
```

Open the Allure report using its local server:

```bash
npx allure open reports/api/qa/smoke/allure-report
```

**Important:** Prefer `allure open` instead of opening `index.html` directly. Direct file access may produce a `500 Load failed` error because the browser cannot load all report resources correctly.

If you need to regenerate the Allure HTML report manually:

```bash
npx allure generate reports/api/qa/smoke/allure-results \
  -o reports/api/qa/smoke/allure-report --clean
```

### Excel report

Generate only the Excel report:

```bash
npm run cli -- api --suite smoke --reporters excel
```

Output:

```text
reports/api/qa/smoke/api-report.xlsx
```

Open the workbook on macOS:

```bash
open reports/api/qa/smoke/api-report.xlsx
```

The workbook contains:

- **Summary:** Project, environment, suite, execution date, and test counts.
- **Test Results:** Test case, suite, status, duration, environment, and error details.

### Multiple reporting formats

Use a comma-separated list to generate more than one report format.

Generate HTML and Allure:

```bash
npm run cli -- api --suite smoke --reporters html,allure
```

Generate HTML and Excel:

```bash
npm run cli -- api --suite smoke --reporters html,excel
```

Generate all three formats:

```bash
npm run cli -- api --suite smoke --reporters html,allure,excel
```

When multiple formats are selected, the tests execute once and the requested reports are generated from that execution.

Supported values are `html`, `allure`, and `excel`. Unsupported reporter names are rejected by the shared reporting configuration.

## Report Directory Structure

Reports are organized by project, environment, and suite.

For example, reports for the API smoke suite in QA are stored under:

```text
reports/
└── api/
    └── qa/
        └── smoke/
            ├── api-report.html
            ├── api-report.xlsx
            ├── allure-results/
            └── allure-report/
                └── index.html
```

The available files depend on the reporting formats selected for the execution.

For another environment or suite, the corresponding directory changes. For example:

```text
reports/api/dev/regression/
reports/api/qa/negative/
```

## Project Structure

```text
projects/apiproject/
├── cli.js
├── runner.js
├── api/
│   ├── BaseApi.js
│   └── PostsApi.js
├── config/
│   └── apiproject.config.js
├── testData/
│   └── postData.js
├── tests/
│   ├── posts.test.js
│   └── jsonplaceholder.crud.test.js
└── README.md
```

Shared framework components are maintained outside the project:

```text
commonlib/
├── logger.js
├── reportConfig.js
├── reportManager.js
└── excelReporter.js
```

The API configuration currently defines QA and DEV base URLs. Review `projects/apiproject/config/apiproject.config.js` when changing environment settings.

## API Test Design

The project contains API tests using SuperTest and Chai.

- `BaseApi.js` provides reusable HTTP request methods.
- `PostsApi.js` contains operations for the Posts API.
- `testData/postData.js` contains reusable test data.
- The test files contain API test cases and assertions.

Tests use JSONPlaceholder as the current demonstration API. Its write operations are simulated and should not be treated as persistent database changes.

## Logging and Configuration

The API project uses the shared logger at:

```text
commonlib/logger.js
```

Reporting options and output paths are managed through:

```text
commonlib/reportConfig.js
commonlib/reportManager.js
```

Excel report generation is implemented in:

```text
commonlib/excelReporter.js
```

Environment selection is passed through the framework CLI and made available to the API configuration using `QA_PLAYGROUND_ENV`.

Keep credentials, tokens, and other sensitive values out of test files and committed configuration. Use environment variables or approved secrets storage when authentication is introduced.

## Troubleshooting

### No tests matched the selected suite

Check that the tests contain the expected tags:

```text
@smoke
@regression
@negative
```

Also confirm that the selected suite is spelled correctly.

### Allure report does not open correctly

Ensure the report has been generated and open it using:

```bash
npx allure open reports/api/qa/smoke/allure-report
```

If necessary, regenerate it from `allure-results` using the command documented above.

### Excel report is missing

Confirm that `excel` was included in `--reporters` and that the command completed successfully.

### API request failures

Verify that the configured base URL is reachable and that the test assertions match the API response.

### Exit status

The CLI returns a non-zero exit code when test execution fails, no tests match the selected suite, or report generation fails.

## GitHub Actions

The API runner can be invoked from automation workflows using the same CLI commands documented above.

For example:

```bash
npm run cli -- api --env qa --suite smoke --reporters html,allure,excel
```

Ensure the CI environment installs the project dependencies and has Java available if using the classic Allure CLI. Configure report artifact upload and retention in the workflow as required.

A locally successful run does not by itself confirm that the GitHub Actions workflow has succeeded.

## Related Documentation

For shared CLI options, global configuration, framework structure, and contribution guidance, see the [root README](../../README.md).
