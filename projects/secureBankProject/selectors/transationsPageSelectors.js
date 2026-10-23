const transactionsPageSelectors = {
    transactionsLink: {
        type: 'role',
        role: 'link',
        name: 'Transactions View all account activity',
        exact: false
    },

    heading: {
        type: 'role',
        role: 'heading',
        name: 'Transactions',
        exact: false
    },

    searchInput: {
        type: 'role',
        role: 'textbox',
        name: 'Search',
        exact: false
    },

    accountDropdown: {
        type: 'role',
        role: 'combobox',
        name: 'Account',
        exact: false
    },

    allTransactionsButton: {
        type: 'role',
        role: 'button',
        name: 'All',
        exact: true
    },

    creditsButton: {
        type: 'role',
        role: 'button',
        name: 'Credits',
        exact: true
    },

    debitsButton: {
        type: 'role',
        role: 'button',
        name: 'Debits',
        exact: true
    },

    clearButton: {
        type: 'role',
        role: 'button',
        name: 'Clear',
        exact: true
    },

    transactionsTable: {
        type: 'role',
        role: 'table',
        name: 'All account transactions',
        exact: false
    },

    transactionRows: {
        type: 'css',
        value: 'tbody tr',
        within: {
            type: 'role',
            role: 'table',
            name: 'All account transactions',
            exact: false
        }
    },

    dateColumnHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Date',
        exact: false,
        within: {
            type: 'role',
            role: 'table',
            name: 'All account transactions',
            exact: false
        }
    },

    accountColumnHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Account',
        exact: false,
        within: {
            type: 'role',
            role: 'table',
            name: 'All account transactions',
            exact: false
        }
    },

    descriptionColumnHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Description',
        exact: false,
        within: {
            type: 'role',
            role: 'table',
            name: 'All account transactions',
            exact: false
        }
    },

    categoryColumnHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Category',
        exact: false,
        within: {
            type: 'role',
            role: 'table',
            name: 'All account transactions',
            exact: false
        }
    },

    amountColumnHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Amount',
        exact: false,
        within: {
            type: 'role',
            role: 'table',
            name: 'All account transactions',
            exact: false
        }
    },

    noResultsMessage: {
        type: 'text',
        value: 'No transactions match your filters.',
        exact: true
    },

    pagination: {
        type: 'role',
        role: 'navigation',
        name: 'Transaction pagination',
        exact: false
    },

    paginationStatus: {
        type: 'css',
        value: 'p',
        within: {
            type: 'role',
            role: 'navigation',
            name: 'Transaction pagination',
            exact: false
        }
    },

    previousPageButton: {
        type: 'role',
        role: 'button',
        name: 'Previous page',
        exact: false,
        within: {
            type: 'role',
            role: 'navigation',
            name: 'Transaction pagination',
            exact: false
        }
    },

    nextPageButton: {
        type: 'role',
        role: 'button',
        name: 'Next page',
        exact: false,
        within: {
            type: 'role',
            role: 'navigation',
            name: 'Transaction pagination',
            exact: false
        }
    },

    downloadCsvButton: {
        type: 'role',
        role: 'button',
        name: 'Download CSV',
        exact: false,
        within: {
            type: 'role',
            role: 'navigation',
            name: 'Transaction pagination',
            exact: false
        }
    }
};

export default transactionsPageSelectors;
