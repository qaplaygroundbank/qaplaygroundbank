const billPaySelectors = {
    billPayMenuLink: {
        type: 'role',
        role: 'link',
        name: 'Bill Pay'
    },

    fromAccountDropdown: {
        type: 'role',
        role: 'combobox',
        name: 'From Account'
    },

    accountOption: {
        type: 'role',
        role: 'option',
        name: 'Everyday Checking'
    },

    billerSearchInput: {
        type: 'testId',
        value: 'biller-search-input'
    },

    billerOption: {
        type: 'testId',
        value: 'biller-option'
    },

    amountInput: {
        type: 'testId',
        value: 'bill-amount-input'
    },

    memoInput: {
        type: 'testId',
        value: 'memo-input'
    },

    reviewPaymentButton: {
        type: 'role',
        role: 'button',
        name: 'Review Payment'
    },

    confirmPaymentButton: {
        type: 'testId',
        value: 'confirm-bill-btn'
    },

    billPayPageTitle: {
        type: 'role',
        role: 'heading',
        name: 'Pay a Bill'
    },

    confirmPaymentHeading: {
        type: 'role',
        role: 'heading',
        name: 'Confirm Bill Payment'
    },

    successHeading: {
        type: 'testId',
        value: 'bill-pay-success-heading'
    },

    referenceNumber: {
        type: 'testId',
        value: 'bill-pay-ref-id'
    },
    // ADD NEW SELECTORS HERE
    addBillerButton: {
        type: 'role',
        role: 'button',
        name: 'Add'
    },
    
    addBillerHeading: {
        type: 'role',
        role: 'heading',
        name: 'Add New Biller'
    },
    newBillerNameInput: {
    type: 'placeholder',
    value: 'e.g. City Electric Co.'
    },

    accountReferenceInput: {
        type: 'placeholder',
        value: 'e.g. ACC-0042'
    },

    submitAddBillerButton: {
        type: 'role',
        role: 'button',
        name: 'Add Biller'
    },

    paymentDateInput: {
    type: 'label',
    value: 'Payment Date'
}

};

export default billPaySelectors;