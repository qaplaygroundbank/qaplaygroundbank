# Migration Automation Project

This directory is reserved for migration-related automation in QA Playground Bank. It is registered with the shared CLI and follows the same command pattern as the UI and API projects.

> **Current status:** The migration CLI and runner are scaffolding/placeholders. The runner currently logs the selected environment and suite but does not perform a migration or execute migration tests. A successful command only confirms that CLI routing works.

## Prerequisites and setup

Run these commands from the repository root:

```bash
npm ci
npm run cli -- --help
npm run cli -- migration --help
```

## Current command

The shared CLI accepts environment and suite options:

```bash
npm run cli -- migration
npm run cli -- migration --env qa --suite smoke
npm run cli -- migration --env stage --suite regression
```

These commands currently invoke the placeholder runner. They do not execute migration operations or validate migrated data.

## Intended project layout

```text
projects/migrationproject/
├── cli.js                         # Registers the migration CLI command
├── runner.js                      # Current placeholder runner
├── config/
│   └── migrationproject.config.js # Configuration location
├── tests/
│   └── sampleTest.spec.js         # Test location
└── README.md
```

Some files or directories may currently be empty. This layout describes the current scaffold and intended organization, not completed migration automation.

## Implementation guidance

Before implementing migration tests, document:

- The source and target systems and supported environments.
- Required connection settings and where secrets are stored.
- Pre-migration checks and post-migration validation.
- How test data is selected, protected, and cleaned up.
- Failure handling, rollback expectations, and safe re-run behavior.
- How migration suites are selected and how results are reported.

Do not put connection strings, passwords, tokens, or other secrets in source files or README examples. Use environment variables or an approved secrets manager.

Use the shared logger from `commonlib/logger.js` rather than creating a separate project-specific logger.

## GitHub Actions

The manual workflow offers `migration` as a project choice and passes the selected environment and suite to the CLI. The current workflow invocation reaches the placeholder runner only. Update this README after migration execution is implemented and validated.

For common setup, CLI options, environment handling, contribution workflow, and CI details, see the [root README](../../readme.md).
