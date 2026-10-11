# QA Playground Bank

QA Playground Bank is a Node.js and Playwright-based QA automation framework designed for learning, practicing, and building maintainable test automation.

The framework provides a common structure and execution mechanism for different QA automation projects.

## Projects

The framework currently supports:

- **UI Automation** - Playwright-based browser automation
- **API Automation** - API test automation
- **Migration Automation** - Migration-related automation

## Benefits for QA Teams and Organizations

- Common automation structure across projects
- Consistent test execution through a single CLI
- Easier onboarding for new QA engineers
- Separation of UI, API, and Migration projects
- Reusable test components and utilities
- Easy integration with CI/CD pipelines
- Platform-independent execution on macOS, Linux, Windows, and GitHub Actions
- Simple and maintainable architecture

## Technology Stack

- Node.js
- JavaScript
- Playwright
- Commander.js
- npm
- Git
- GitHub
- GitHub Actions

---

## Prerequisites

Before running the tests, make sure the following are installed:

- Node.js 18 or newer
- npm
- Git
- A modern browser environment supported by Playwright

Verify the installations:

```bash
node --version
npm --version
git --version

Setup
1. Clone the repository
git clone <repository-url>
cd qaplaygroundbank

2. Install project dependencies
npm install

3. Install Playwright browser binaries
npx playwright install

Verify the Framework
Display the available framework commands:
npm run cli -- --help

Expected commands:
api
migration
ui

Running Tests
UI Project
Run the UI project:
npm run cli -- ui

Run the UI project with environment and suite:
npm run cli -- ui --env qa --suite smoke

Example:
npm run cli -- ui --env qa --suite regression

API Project
Run the API project:
npm run cli -- api

Run with environment and suite:
npm run cli -- api --env qa --suite smoke

Migration Project
Run the Migration project:
npm run cli -- migration

Run with environment and suite:
npm run cli -- migration --env qa --suite smoke

Command-Line Options
Environment
Use --env to specify the execution environment.
Example:
npm run cli -- ui --env qa

Typical environments may include:
dev
qa
uat
prod

The environments available depend on the project configuration.
Suite
Use --suite to specify the test suite.
Example:
npm run cli -- ui --suite smoke

Typical suites may include:
smoke
regression
sanity

The available suites depend on the project configuration.
Running Playwright Directly
The framework CLI should normally be used for project-level execution.
Playwright can also be executed directly for development and debugging.
Run all Playwright tests
npx playwright test

Run a specific test file
npx playwright test projects/uiproject/tests/sendMoney.spec.js

Run tests in headed mode
npx playwright test --headed

Run tests in Playwright UI mode
npx playwright test --ui

Open the HTML report
npx playwright show-report

Project Structure
qaplaygroundbank/
│
├── bin/
│   └── qaplayground.js
│
├── cli/
│   ├── index.js
│   ├── options.js
│   └── registerProjects.js
│
├── commonlib/
│   ├── util.js
│   ├── logger.js
│   └── commandRunner.js
│
├── globalconfigs/
│   ├── config.js
│   ├── constants.js
│   └── environments.js
│
├── projects/
│   │
│   ├── apiproject/
│   │   ├── cli.js
│   │   ├── runner.js
│   │   ├── config/
│   │   ├── fixtures/
│   │   └── tests/
│   │
│   ├── migrationproject/
│   │   ├── cli.js
│   │   ├── runner.js
│   │   ├── config/
│   │   └── tests/
│   │
│   └── uiproject/
│       ├── cli.js
│       ├── runner.js
│       ├── config/
│       ├── data/
│       ├── fixtures/
│       ├── pages/
│       ├── tests/
│       └── utils/
│
├── playwright.config.js
├── package.json
├── Makefile
└── readme.md

UI Project
projects/uiproject/
├── cli.js
├── runner.js
├── config/
├── data/
├── fixtures/
├── pages/
├── tests/
└── utils/

- tests/ - Playwright test specifications
- pages/ - Page Object classes and page-specific actions
- fixtures/ - Reusable Playwright fixtures and test setup
- data/ - Test data
- utils/ - Project-specific utility functions
- config/ - UI project configuration
- cli.js - UI project CLI registration
- runner.js - UI project test execution
Adding a UI Test
Create the test under:
projects/uiproject/tests/

Example:
projects/uiproject/tests/login.spec.js

Example test:
import { test, expect } from '@playwright/test';

test('Verify login page', async ({ page }) => {
    await page.goto('https://example.com');

    await expect(page).toHaveTitle(/Example/);
});

Run the UI project:
npm run cli -- ui

Recommended Workflow
- Add tests under the appropriate project's tests/ directory.
- Keep selectors and page actions in pages/ classes when using Page Object Model.
- Store reusable test data in the project's data/ directory.
- Use fixtures for reusable test setup.
- Keep project-specific utilities in the appropriate utils/ directory.
- Run targeted tests while developing.
- Run the relevant suite after completing changes.
- Run the complete automation before creating a Pull Request.
- Keep tests readable and maintainable.
- Avoid unnecessary framework complexity.
Test Reports
Playwright uses the configured HTML reporter.
Open the latest HTML report:
npx playwright show-report

The report can provide:
- Passed tests
- Failed tests
- Test duration
- Errors
- Test steps
- Screenshots
- Traces when configured
Git Workflow
The recommended branch workflow is:
main
  │
  ▼
development
  │
  ├── Developer Branch
  ├── Developer Branch
  └── Developer Branch
          │
          ▼
     Pull Request
          │
          ▼
     Code Review
          │
          ▼
     development
          │
          ▼
         main

Create a working branch from development:
git switch development
git pull
git switch -c feature/my-new-test

Commit changes:
git add .
git commit -m "Add customer login test"

Push the branch:
git push -u origin feature/my-new-test

Create a Pull Request targeting:
development

Before creating a Pull Request:
- Run the relevant tests.
- Review the test report.
- Remove debugging code.
- Do not commit passwords, tokens, or other secrets.
- Provide a clear Pull Request description.
CI/CD
The framework is designed to support GitHub Actions and other CI/CD systems.
The same commands used locally can be used in CI/CD:
npm install
npx playwright install
npm run cli -- ui --env qa --suite smoke

The intended execution flow is:
Developer Machine
       │
       ▼
Framework CLI
       │
       ▼
Project Runner
       │
       ▼
Playwright
       │
       ▼
Tests

The same flow can be executed through GitHub Actions.
Framework Principles
- Keep the framework simple.
- Prefer clarity over unnecessary abstraction.
- Keep UI, API, and Migration projects independent.
- Reuse code when there is a genuine need.
- Keep configuration separate from test implementation.
- Keep tests readable and maintainable.
- Keep local and CI/CD execution consistent.
- Make the framework easy for QA engineers to understand and extend.
- Introduce new framework components gradually.
Project Status
The framework is under active development.
Current areas include:
- CLI framework
- Project runners
- UI automation
- Playwright integration
- Environment handling
- Test suite execution
- Fixtures
- Page Objects
- API automation
- Migration automation
- CI/CD integration
The framework will evolve as new automation requirements are introduced.
Notes
This repository is intended for learning, experimentation, and organizational QA automation development.
The framework is designed so that QA engineers can understand, use, maintain, and extend it without requiring them to be software framework developers.
License
This project is currently intended for learning, experimentation, and organizational QA automation development.
If this repository is distributed publicly, add the appropriate open-source license information here.
```