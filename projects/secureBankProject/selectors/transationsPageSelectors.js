constructor(page) ; {

    super(page);

    // Navigation
    this.transactionsLink = page.getByRole('link', {
        name: /Transactions/i
    });

    // Heading
    this.heading = page.getByRole('heading', {
        name: 'Transactions',
        exact: true
    });

    // Filters
    this.searchInput = page.getByRole('textbox', {
        name: 'Search'
    });

    this.accountDropdown = page.getByRole('combobox', {
        name: 'Account'
    });

    this.allTransactionsButton = page.getByRole('button', {
        name: 'All',
        exact: true
    });

    this.creditsButton = page.getByRole('button', {
        name: 'Credits',
        exact: true
    });

    this.debitsButton = page.getByRole('button', {
        name: 'Debits',
        exact: true
    });

    this.clearButton = page.getByRole('button', {
        name: 'Clear',
        exact: true
    });

    // Table
    this.transactionsTable = page.getByRole('table', {
        name: 'All account transactions'
    });

    this.transactionRows =
        this.transactionsTable.locator('tbody tr');

    this.dateColumnHeader =
        this.transactionsTable.getByRole('columnheader', {
            name: 'Date',
            exact: true
        });

    this.accountColumnHeader =
        this.transactionsTable.getByRole('columnheader', {
            name: 'Account',
            exact: true
        });

    this.descriptionColumnHeader =
        this.transactionsTable.getByRole('columnheader', {
            name: 'Description',
            exact: true
        });

    this.categoryColumnHeader =
        this.transactionsTable.getByRole('columnheader', {
            name: /Category/i
        });

    this.amountColumnHeader =
        this.transactionsTable.getByRole('columnheader', {
            name: /Amount/i
        });

    // Empty state
    this.noResultsMessage = page.getByText(
        'No transactions match your filters.',
        { exact: true }
    );

    // Pagination
    this.pagination = page.getByRole('navigation', {
        name: 'Transaction pagination'
    });

    this.paginationStatus = this.pagination.locator('p');

    this.previousPageButton =
        this.pagination.getByRole('button', {
            name: 'Previous page'
        });

    this.nextPageButton =
        this.pagination.getByRole('button', {
            name: 'Next page'
        });

    this.downloadCsvButton =
        this.pagination.getByRole('button', {
            name: 'Download CSV'
        });
}
