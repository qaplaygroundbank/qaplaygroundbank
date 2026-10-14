# ParaBank UI Automation Project

This project contains Playwright browser tests for the ParaBank application. It is executed through the repository's shared CLI and uses its own Playwright configuration, page objects, fixtures, selectors, and test data.

## Prerequisites and setup

Run these commands from the repository root:

```bash
npm ci
npx playwright install
npm run cli -- parabank --help
```

The ParaBank project loads environment configuration from the root `.env` file when present. See the root README for the complete variable list and secret-handling guidance.

## Running ParaBank tests

All commands below must be run from the repository root.

Run the default smoke suite:

```bash
npm run cli -- parabank
```

Choose an environment and suite:

```bash
npm run cli -- parabank --env qa --suite smoke
npm run cli -- parabank --env qa --suite regression
```

Select a browser:

```bash
npm run cli -- parabank --env qa --suite regression --browser chromium
npm run cli -- parabank --env qa --suite regression --browser firefox
npm run cli -- parabank --env qa --suite regression --browser webkit
```

Run one test file. The `--test-file` path is relative to `projects/paraBankProject/`:

```bash
npm run cli -- parabank --env qa --suite regression --test-file tests/login/loginTest.spec.js
```

Run the browser in headed mode:

```bash
npm run cli -- parabank --env qa --suite smoke --headed
```

## Suite filtering

The runner treats `regression` as all tests. Other suite values are interpreted as tags.

For example, `--suite smoke` selects tests marked with `@smoke`.

Multiple tags can be provided as comma-separated values:

```bash
npm run cli -- parabank --env qa --suite smoke,login
```

Ensure the requested tags exist in the test files. A test without a matching tag will not be selected during a tag-filtered run.

## Environment configuration

The ParaBank project supports environment-based configuration through the root `.env` file.

Environment-specific URLs, usernames, and passwords should be managed through environment variables rather than hardcoded in test files.

Create a root `.env` file for local use and keep it out of version control.

In CI/CD, configure credentials and other sensitive values as repository or pipeline secrets rather than committing them to Git.

## Project layout

```text
projects/paraBankProject/
├── cli.js                         # Registers the ParaBank CLI command
├── runner.js                      # Builds and launches the Playwright command
├── config/
│   ├── app.config.js              # Environment URLs and credentials
│   └── paraBankProject.config.js  # ParaBank Playwright projects and reporter
├── testData/                      # ParaBank test data
├── fixtures/
│   └── baseFixture.js             # Shared fixtures and Page Object fixtures
├── pages/                         # Page Object classes
├── selectors/                     # Centralized selectors
├── tests/                         # Playwright test specifications
│   └── login/
└── utils/                         # ParaBank-specific utilities
```

## Test implementation guidelines

- Keep test scenarios under `tests/`.
- Organize tests by ParaBank application feature.
- Keep page-specific interactions in the relevant Page Object class under `pages/`.
- Follow the Page Object Model (POM) pattern.
- Reuse `fixtures/baseFixture.js` for Page Object fixtures.
- Avoid creating Page Objects directly in test files when suitable fixtures are available.
- Keep reusable selectors under `selectors/`.
- Store reusable test data under `testData/`.
- Keep environment-specific configuration under `config/`.
- Use the shared logger from `commonlib/logger.js`.
- Prefer accessible Playwright locators such as `getByRole`, `getByLabel`, and `getByTestId`.
- Do not hardcode URLs, usernames, or passwords in test files.
- Keep assertions explicit and focused on expected application behaviour.
- Use `beforeEach` for common setup steps required by every test.
- Use `afterEach` for common cleanup steps when required.

## Browser configuration and reports

The ParaBank configuration defines Playwright projects for Chromium, Firefox, and WebKit.

The runner selects one browser per invocation using `--browser`. Run the command separately for each browser when cross-browser validation is required