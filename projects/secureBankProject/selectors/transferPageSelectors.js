const transferPageSelectors = {
    transferMenu: {
        type: 'testId',
        value: 'sidebar-link-transfer'
    },

    transferHeading: {
        type: 'role',
        role: 'heading',
        name: 'Transfer Money'
    },

    fromAccountDropdown: {
        type: 'role',
        role: 'combobox',
        name: 'From Account'
    },

    toAccountDropdown: {
        type: 'role',
        role: 'combobox',
        name: 'To Account'
    },

    amountInput: {
        type: 'role',
        role: 'spinbutton',
        name: 'Amount'
    },

    reviewTransferButton: {
        type: 'testId',
        value: 'review-transfer-btn'
    },

    errorMessage: {
        type: 'testId',
        value: 'transfer-error-message'
    }
};

export default transferPageSelectors;