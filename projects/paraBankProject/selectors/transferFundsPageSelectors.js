// Transfer Funds page selectors
const transferFundsPageSelectors = {
    // Transfer Funds menu link
    transferFundsLink: {
        type: 'css',
        value: 'a[href="transfer.htm"]'
    },
 
    // Transfer Funds page title
    transferFundsTitle: {
        type: 'css',
        value: '#rightPanel h1'
    },
 
    // Amount input field
    amountInput: {
        type: 'css',
        value: '#amount'
    },
 
    // From account dropdown
    fromAccountDropdown: {
        type: 'css',
        value: '#fromAccountId'
    },
 
    // To account dropdown
    toAccountDropdown: {
        type: 'css',
        value: '#toAccountId'
    },
 
    // Transfer button
    transferButton: {
        type: 'css',
        value: 'input[type="submit"][value="Transfer"]'
    },
 
    // Successful transfer heading
    transferSuccessMessage: {
        type: 'role',
        role: 'heading',
        name: 'Transfer Complete!',
        exact: true
    },
 
    // Transfer confirmation details
    transferConfirmationDetails: {
        type: 'css',
        value: '#rightPanel p'
    },
 
    // Error heading
    errorHeading: {
        type: 'role',
        role: 'heading',
        name: 'Error!',
        exact: true
    },
 
    // Error message
    errorMessage: {
        type: 'css',
        value: '#rightPanel p.error:not([id])'
    }
};
 
export default transferFundsPageSelectors;