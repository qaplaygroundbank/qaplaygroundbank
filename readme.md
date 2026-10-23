# QA Playground Bank

QA Playground Bank is a JavaScript automation framework built on Node.js. A shared command-line interface (CLI) dispatches work to independent UI, API, and migration projects. The projects share common configuration and logging utilities; API and SecureBank also use shared reporting utilities.

## Projects

| Project | Type | CLI command | Status |
|---|---|---|---|
| SecureBank | Playwright UI tests | `securebank` | Implemented |
| ParaBank | Playwright UI tests | `parabank` | Implemented |
| API | Mocha, Chai, and SuperTest tests | `api` | Implemented |
| Migration | Migration automation | `migration` | Scaffold only; it does not execute migration tests |

## Getting started

Use a supported Node.js LTS release and npm. From the repository root, install dependencies and Playwright browsers:

```bash
npm ci
npx playwright install
npm run cli -- --help
```

On Linux CI machines, install browser system dependencies with:

```bash
npx playwright install --with-deps
```

## Running projects

Run commands from the repository root. The shared defaults are `qa` for the environment and `smoke` for the suite.

```bash
npm run cli -- securebank
npm run cli -- parabank
npm run cli -- api
npm run cli -- migration
```

<<<<<<< HEAD
The available project commands are `ui`, `api`, `migration`, `parabank`, and
`anz`.
=======
Specify an environment and suite with `--env` and `--suite`:

```bash
npm run cli -- securebank --env qa --suite smoke
npm run cli -- api --env dev --suite regression
```

Use each project command's help for its available options:

```bash
npm run cli -- securebank --help
npm run cli -- parabank --help
npm run cli -- api --help
npm run cli -- migration --help
```

The UI commands accept browser selection, headed mode, and a project-relative `--test-file`. API and SecureBank accept `--reporters` (`html`, `allure`, `excel`, or a comma-separated combination). Suite filtering differs by project; consult the project README for supported suites and tags.
>>>>>>> 80922ceaa4f81644cf6d6155d01dee7e7861e689

## Configuration and secrets

SecureBank and ParaBank load a `.env` file from the repository root when present. The UI projects use these environment variables:

| Variables | Purpose |
|---|---|
| `UI_QA_LOGIN_URL`, `UI_QA_USERNAME`, `UI_QA_PASSWORD` | QA application URL and credentials |
| `UI_DEV_LOGIN_URL`, `UI_DEV_USERNAME`, `UI_DEV_PASSWORD` | Dev application URL and credentials |
| `UI_STAGE_LOGIN_URL`, `UI_STAGE_USERNAME`, `UI_STAGE_PASSWORD` | Stage application URL and credentials |
| `LOG_LEVEL` | Shared logger threshold: `debug`, `info`, `warn`, or `error` |

The UI projects provide their own QA URL defaults. Dev and Stage URLs must be configured when using those environments. Tests that log in require the selected environment's credentials. The API project currently defines its QA and DEV base URLs in its project configuration.

Keep `.env` and all credentials, tokens, and other secrets out of version control. For CI, use repository or environment secrets and avoid placing real credentials in source files or documentation.

## Reports

API and SecureBank write selected reports under `reports/<project>/<environment>/<suite>/`. ParaBank uses its Playwright HTML reporter. Migration currently generates no test report. Report formats and commands are documented in the relevant project README.

Generated reports and local test results may be present in the working tree; check their timestamps or regenerate them before treating them as the result of a current run.

<<<<<<< HEAD
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

### ANZ Commercial CRM demo

The `anz` project runs against a local ANZ-themed CRM demo using fictional
customer data. It is a self-contained automation fixture and does not connect
to ANZ systems.

```bash
npm run cli -- anz --suite smoke
npm run cli -- anz --suite regression --browser chromium
npm run cli -- anz --suite regression --test-file tests/commercialCrm.spec.js
```

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
=======
## Repository layout
>>>>>>> 80922ceaa4f81644cf6d6155d01dee7e7861e689

```text
bin/                 CLI executable
cli/                 Shared CLI setup and project registration
commonlib/           Shared logger and reporting utilities
globalconfigs/       Shared CLI defaults and constants
projects/            Independent automation projects
reports/             Generated project reports
```

Each project owns its command registration, runner, configuration, and tests. UI projects additionally organize browser tests around fixtures, page objects, selectors, test data, and utilities.

## CI and legacy shortcuts

The manual GitHub Actions workflow supports the registered `securebank`, `parabank`, and `api` CLI commands. It currently runs against QA; UI credentials are supplied through GitHub Actions secrets, and generated reports are uploaded as workflow artifacts.

The Makefile still refers to a `ui` CLI command, which is not registered by the current CLI. Its UI shortcut is not usable until it is updated to target `securebank` or `parabank`; that change is being handled separately.

## Project documentation

- [API Automation Project](projects/apiproject/README.md)
- [Migration Automation Project](projects/migrationproject/README.md)
- [ParaBank UI Automation Project](projects/paraBankProject/README.md)
- [SecureBank UI Automation Project](projects/secureBankProject/README.md)
