function resolveLocator(page, selector) {
    if (!page) {
        throw new Error('Cannot resolve locator: Playwright page is required.');
    }

    if (!selector || typeof selector !== 'object') {
        throw new Error('Cannot resolve locator: a valid selector is required.');
    }

    if (typeof selector.type !== 'string' || !selector.type.trim()) {
        throw new Error('Invalid locator: "type" is required.');
    }

    const requireValue = () => {
        if (typeof selector.value !== 'string' || !selector.value.trim()) {
            throw new Error(
                `Invalid "${selector.type}" locator: "value" must be a non-empty string.`
            );
        }
        return selector.value;
    };

    const exact = selector.exact ?? true;
    const root = selector.within
        ? resolveLocator(page, selector.within)
        : page;

    switch (selector.type) {
        case 'testId':
            return root.getByTestId(requireValue());
        case 'role':
            if (!selector.role || !selector.name) {
                throw new Error('Invalid role locator: "role" and "name" are required.');
            }
            return root.getByRole(selector.role, {
                name: selector.name,
                exact
            });
        case 'label':
            return root.getByLabel(requireValue(), { exact });
        case 'placeholder':
            return root.getByPlaceholder(requireValue(), { exact });
        case 'text':
            return root.getByText(requireValue(), { exact });
        case 'css':
            return root.locator(requireValue());
        case 'id':
            return root.locator(`#${requireValue()}`);
        case 'xpath':
            return root.locator(`xpath=${requireValue()}`);
        default:
            throw new Error(`Unsupported locator type: "${selector.type}".`);
    }
}

export { resolveLocator };
