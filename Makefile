
.PHONY: help ui api migration

ENV ?= qa
SUITE ?= smoke
TEST_FILE ?=
BROWSER ?= chromium
HEADED ?= false

HEADED_OPTION = $(if $(filter true,$(HEADED)),--headed,)

help:
	@echo "QA Playground Bank"
	@echo ""
	@echo "Available commands:"
	@echo "  make ui"
	@echo "  make ui TEST_FILE=tests/loginTest.spec.js"
	@echo "  make ui BROWSER=firefox"
	@echo "  make ui BROWSER=chromium HEADED=true"
	@echo "  make api"
	@echo "  make migration"
	@echo ""
	@echo "Optional arguments:"
	@echo "  ENV=qa|dev|stage"
	@echo "  SUITE=smoke|regression|any-string"
	@echo "  TEST_FILE=path/to/test.spec.js"
	@echo "  BROWSER=chromium|firefox|webkit"
	@echo "  HEADED=true|false"

ui:
	npm run cli -- ui --env $(ENV) --suite $(SUITE) --browser $(BROWSER) $(HEADED_OPTION) $(if $(TEST_FILE),--test-file "$(TEST_FILE)",)

api:
	npm run cli -- api --env $(ENV) --suite $(SUITE)

migration:
	npm run cli -- migration --env $(ENV) --suite $(SUITE)
