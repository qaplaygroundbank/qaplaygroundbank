/**
 * Resolves a locator definition into a Playwright Locator.
 *
 * Supported types:
 * testId, role, label, placeholder, text, css, id, xpath
 *
 * @param {import('@playwright/test').Page} page
 * @param {object} selector
 * @returns {import('@playwright/test').Locator}
 */
function resolveLocator(page, selector) {
    if (!page) {
        throw new Error(
            'Cannot resolve locator: Playwright page is required.'
        );
    }

    if (!selector || typeof selector !== 'object') {
        throw new Error(
            'Cannot resolve locator: a valid selector definition is required.'
        );
    }

    if (typeof selector.type !== 'string' || !selector.type.trim()) {
        throw new Error(
            'Invalid locator definition: "type" is required.'
        );
    }

    const requireValue = () => {
        if (
            typeof selector.value !== 'string' ||
            !selector.value.trim()
        ) {
            throw new Error(
                `Invalid "${selector.type}" locator: ` +
                '"value" must be a non-empty string.'
            );
        }

        return selector.value;
    };

    const exact = selector.exact ?? true;

    switch (selector.type) {
        case 'testId':
            return page.getByTestId(requireValue());

        case 'role':
            if (
                typeof selector.role !== 'string' ||
                !selector.role.trim()
            ) {
                throw new Error(
                    'Invalid role locator: "role" is required.'
                );
            }

            if (
                typeof selector.name !== 'string' ||
                !selector.name.trim()
            ) {
                throw new Error(
                    'Invalid role locator: "name" is required.'
                );
            }

            return page.getByRole(selector.role, {
                name: selector.name,
                exact
            });

        case 'label':
            return page.getByLabel(requireValue(), { exact });

        case 'placeholder':
            return page.getByPlaceholder(requireValue(), { exact });

        case 'text':
            return page.getByText(requireValue(), { exact });

        case 'css':
            return page.locator(requireValue());

        case 'id':
            return page.locator(`#${requireValue()}`);

        case 'xpath':
            return page.locator(`xpath=${requireValue()}`);

        default:
            throw new Error(
                `Unsupported locator type: "${selector.type}". ` +
                'Supported types: testId, role, label, placeholder, ' +
                'text, css, id, xpath.'
            );
    }
}

export { resolveLocator };
