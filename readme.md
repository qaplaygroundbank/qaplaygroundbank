# QA Playground Bank

QA Playground Bank is a JavaScript-based automation framework built with Node.js and Playwright. It provides a shared command-line interface (CLI) for organizing automation work into separate UI, API, and migration projects.

> **Current implementation status:** UI automation is implemented and has been validated locally. The API and migration runners are currently scaffolding/placeholders; their CLI commands run, but they do not yet execute real API or migration test suites.

## Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Configuration and secrets](#configuration-and-secrets)
- [Run projects](#run-projects)
- [CLI options](#cli-options)
- [Makefile shortcuts](#makefile-shortcuts)
- [Reports and troubleshooting](#reports-and-troubleshooting)
- [Repository structure](#repository-structure)
- [Development and contribution workflow](#development-and-contribution-workflow)
- [GitHub Actions](#github-actions)

## Prerequisites

Install the following:

- Node.js 18 or newer (use a currently supported LTS version where possible)
- npm, which is included with Node.js
- Git
- A supported operating system for Playwright browsers

Check the installations:

```bash
node --version
npm --version
git --version
```

## Setup

Clone the repository and move into its root directory:

```bash
git clone <repository-url>
cd qaplaygroundbank
```

Install the dependencies recorded in `package-lock.json`:

```bash
npm ci
```

Install Playwright browser binaries for local development:

```bash
npx playwright install
```

On Linux CI machines, browser system dependencies can also be installed with:

```bash
npx playwright install --with-deps
```

Display the available CLI commands:

```bash
npm run cli -- --help
```

The available project commands are `ui`, `api`, and `migration`.

## Configuration and secrets

### Local `.env` file

The UI configuration loads a `.env` file from the repository root. Create that file locally and do not commit it. Store credentials only in local environment variables or your organization's approved secrets manager.

Example structure (replace the placeholder values locally):

```dotenv
UI_QA_LOGIN_URL=https://qaplayground.com/bank/login
UI_QA_USERNAME=your_qa_username
UI_QA_PASSWORD=your_qa_password

UI_DEV_LOGIN_URL=
UI_DEV_USERNAME=
UI_DEV_PASSWORD=

UI_STAGE_LOGIN_URL=
UI_STAGE_USERNAME=
UI_STAGE_PASSWORD=

LOG_LEVEL=info
```

The QA login URL has a default fallback in the UI configuration. Dev and stage URLs must be configured if those environments are to be used. Credentials are required by tests that use the configured credential helper.

Supported UI configuration variables:

| Variable | Purpose |
|---|---|
| `UI_QA_LOGIN_URL` | QA application's login URL |
| `UI_QA_USERNAME` / `UI_QA_PASSWORD` | QA login credentials |
| `UI_DEV_LOGIN_URL` | Dev application's login URL |
| `UI_DEV_USERNAME` / `UI_DEV_PASSWORD` | Dev login credentials |
| `UI_STAGE_LOGIN_URL` | Stage application's login URL |
| `UI_STAGE_USERNAME` / `UI_STAGE_PASSWORD` | Stage login credentials |
| `LOG_LEVEL` | Shared logger threshold: `debug`, `info`, `warn`, or `error` |

The CLI's default environment is `qa` and its default suite is `smoke`. The UI runner passes the selected environment through `QA_PLAYGROUND_ENV`.

### Keep secrets out of Git

- Do not commit `.env`, passwords, access tokens, or other credentials.
- Keep `.env` in `.gitignore`.
- Do not put real credentials in README examples or test source code.
- In GitHub Actions, store credentials as repository or environment secrets.

## Run projects

Run commands from the repository root.

### UI automation

Run the default UI smoke suite on Chromium:

```bash
npm run cli -- ui
```

Choose an environment and suite:

```bash
npm run cli -- ui --env qa --suite smoke
npm run cli -- ui --env qa --suite regression
```

Select a browser:

```bash
npm run cli -- ui --env qa --suite regression --browser chromium
npm run cli -- ui --env qa --suite regression --browser firefox
npm run cli -- ui --env qa --suite regression --browser webkit
```

Run a specific UI test file. The path is relative to `projects/uiproject/`:

```bash
npm run cli -- ui --env qa --suite regression --test-file tests/loginTest.spec.js
```

Run with a visible browser:

```bash
npm run cli -- ui --env qa --suite smoke --headed
```

The UI runner treats `regression` as all tests. Other suite names are used as tags, matching tests with a corresponding annotation such as `@smoke` or `@payments`. Use the tags actually present in the test files.

### API automation

```bash
npm run cli -- api --env qa --suite smoke
```

The API CLI command and runner are currently placeholders. A successful command currently confirms CLI wiring only; it does not mean API tests were executed.

### Migration automation

```bash
npm run cli -- migration --env qa --suite smoke
```

The migration CLI command and runner are currently placeholders. A successful command currently confirms CLI wiring only; it does not mean migration tests were executed.

## CLI options

The project commands share these options:

| Option | Description | Default |
|---|---|---|
| `--env <environment>` | Select the environment | `qa` |
| `--suite <suite>` | Select a suite or tag filter | `smoke` |
| `--browser <browser>` | UI browser: `chromium`, `firefox`, or `webkit` | `chromium` |
| `--headed` | Show the browser UI during UI execution | Off |
| `--test-file <file>` | Run one UI test file; available on `ui` | Not set |

`--browser` is relevant to UI execution. `--test-file` is available only for the UI command.

## Makefile shortcuts

The Makefile provides shorter commands for the same CLI:

```bash
make help
make ui
make ui ENV=qa SUITE=smoke
make ui ENV=qa SUITE=regression BROWSER=chromium
make ui ENV=qa SUITE=regression BROWSER=firefox
make ui ENV=qa SUITE=regression BROWSER=webkit
make ui TEST_FILE=tests/loginTest.spec.js
make ui HEADED=true
make api
make migration
```

Supported Makefile variables:

- `ENV=qa|dev|stage`
- `SUITE=smoke|regression|<tag>`
- `BROWSER=chromium|firefox|webkit`
- `TEST_FILE=tests/<file>.spec.js` (relative to `projects/uiproject/`)
- `HEADED=true|false`

## Reports and troubleshooting

The UI Playwright configuration uses the HTML reporter. After a UI run, open the generated report with:

```bash
npm run report
```

The report is typically generated in `playwright-report/`. The repository may contain local report output; do not treat checked-in or old report files as the latest result unless they were generated by your current run.

Common checks:

1. Confirm dependencies are installed with `npm ci`.
2. Install the required browser with `npx playwright install chromium` (or `firefox` / `webkit`).
3. Confirm the selected environment's URL and credentials are configured.
4. Run `npm run cli -- ui --help` to see UI command options.
5. Use `--test-file` to isolate a failing test.
6. Review the terminal output and the HTML report.

## Repository structure

```text
qaplaygroundbank/
├── bin/
│   └── qaplayground.js          # CLI entry point
├── cli/
│   ├── index.js                 # CLI setup
│   ├── options.js               # Shared CLI options
│   └── registerProjects.js      # Registers project commands
├── commonlib/
│   ├── logger.js                # Shared logger
│   └── util.js                  # Shared utilities (reserved for reusable helpers)
├── globalconfigs/
│   ├── config.js                # Default environment and suite
│   ├── constants.js             # Framework constants
│   └── environments.js          # Environment names
├── projects/
│   ├── apiproject/
│   ├── migrationproject/
│   └── uiproject/
├── playwright.config.js         # Root Playwright config
├── Makefile
├── package.json
└── readme.md
```

Each project has its own `cli.js` and `runner.js`. The UI project has a dedicated Playwright configuration and additional folders for tests, page objects, fixtures, data, selectors, and utilities.

## Development and contribution workflow

Use the branch names and protection rules configured in your repository. The team's current intended flow is:

1. Update your local `development` branch.
2. Create a focused feature or fix branch from `development`.
3. Make one logically related change at a time.
4. Run the relevant tests and review `git diff --check`.
5. Commit with a concise message describing the change.
6. Push the feature branch and open a pull request into `development`.
7. Obtain the required review approval (the repository is intended to require at least one approval) and address review feedback.
8. Merge into `development` according to repository rules.
9. Merge a tested, stable release from `development` into `main` through the team's agreed review process.

Before committing, review `git status --short` and stage only files relevant to the change. Avoid committing `.env`, `node_modules/`, generated reports, or unrelated files.

## GitHub Actions

The repository's manual workflow is intended to be started from **GitHub → Actions → QA Playground Bank → Run workflow**. The workflow inputs select:

- Project: `ui`, `api`, or `migration`
- Environment: `dev`, `qa`, or `stage`
- Suite: `smoke` or `regression`

The workflow installs dependencies with `npm ci`, installs Playwright browsers with `npx playwright install --with-deps`, and invokes the shared CLI.

For QA UI runs, configure the following GitHub Actions secrets:

- `UI_QA_USERNAME`
- `UI_QA_PASSWORD`

The workflow also supplies `UI_QA_LOGIN_URL`. Dev and stage UI runs require the corresponding URL and credential variables to be added to the workflow and configured as secrets/variables before those environments are ready to run. Never hard-code credentials into the workflow.

The API and migration workflow choices currently invoke placeholder runners until those projects are implemented.

## Project-specific documentation

- [UI project README](projects/uiproject/README.md)
- [API project README](projects/apiproject/README.md)
- [Migration project README](projects/migrationproject/README.md)
