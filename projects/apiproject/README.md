# API Automation Project

This directory is the planned home for API automation within QA Playground Bank. It is registered with the shared CLI so that API test execution can use the same top-level command structure as the other projects.

> **Current status:** The API CLI and runner are scaffolding/placeholders. The current runner logs the selected environment and suite but does not execute API requests or API test assertions. A successful command is not evidence that API tests have run.

## Prerequisites and setup

Run from the repository root:

```bash
npm ci
npm run cli -- --help
npm run cli -- api --help
```

Playwright browser installation is needed for browser-based tests, but API-only tests may not require browser binaries once an API test implementation is added.

## Current command

The CLI currently accepts the shared environment and suite options:

```bash
npm run cli -- api
npm run cli -- api --env qa --suite smoke
npm run cli -- api --env dev --suite regression
```

The command currently demonstrates CLI routing only. API request setup, test discovery, assertions, reporting, and environment-specific API configuration still need to be implemented.

## Intended project layout

```text
projects/apiproject/
├── cli.js                     # Registers the API CLI command
├── runner.js                  # Current placeholder runner
├── config/
│   └── apiproject.config.js   # Configuration location
├── fixtures/
│   └── apiproject.fixture.js  # Fixture location
├── tests/
│   └── sampleTest.spec.js     # Test location
└── README.md
```

Some files or directories may currently be empty. Treat this layout as the intended organization, not a claim that API test functionality is already implemented.

## Implementation guidance

When API automation is introduced:

- Define the API base URL and environment-specific configuration.
- Keep credentials and tokens in environment variables or approved secrets storage.
- Create reusable API request fixtures or clients where they reduce duplication.
- Add tests under `tests/` with meaningful assertions.
- Define how suites are selected and how test failures propagate to the CLI exit code.
- Document report output and any setup needed to run the tests locally and in CI.
- Reuse the framework's shared logger from `commonlib/logger.js`.

Do not place secrets in test files, README examples, or committed `.env` files.

## GitHub Actions

The manual workflow offers `api` as a project choice and passes the selected environment and suite to the CLI. At present, that invocation reaches the placeholder runner. Update this README when real API execution is implemented so the documented commands, configuration variables, and test/report behavior reflect the actual implementation.

For common setup, CLI options, environment handling, contribution workflow, and CI details, see the [root README](../../readme.md).
