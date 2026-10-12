# QA Playground Bank

This repository is a Playwright automation project for practicing and building end-to-end UI tests against a banking demo application.

## Prerequisites

Before running the tests, make sure you have the following installed on your machine:

- Node.js (version 18 or newer is recommended)
- npm
- A modern browser environment supported by Playwright

## Setup

1. Open a terminal in the project root.
2. Install project dependencies:

   npm install

3. Install the Playwright browser binaries:

   npx playwright install

## Running Tests

Run the full suite:

npx playwright test

Run a specific test file:

npx playwright test tests/sendMoney.spec.js

Run tests in headed mode (opens the browser UI):

npx playwright test --headed

Run tests in UI mode:

npx playwright test --ui

Open the HTML test report:

npx playwright show-report

## Project Structure

- tests/ - contains Playwright test specs
- pages/ - page object classes for different screens
- fixtures/ - reusable test setup and base fixtures
- testdata/ - JSON files used for test inputs
- utils/ - helper utilities such as logging
- playwright.config.js - Playwright configuration

## Recommended Workflow

- Add tests under the tests/ folder
- Keep selectors and page actions in the pages/ classes
- Store reusable data in the testdata/ folder
- Use the base fixtures to share setup logic across tests
- Run targeted tests first while developing, then run the full suite before completing changes

## Notes

This repo is set up as a starter project for learning and building Playwright-based test automation. You can adjust the test configuration and base URLs in the Playwright config as your application setup evolves.
