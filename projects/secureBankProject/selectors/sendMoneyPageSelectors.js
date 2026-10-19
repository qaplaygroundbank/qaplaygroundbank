// Send money page selectors
const SendMoneyPageSelectors = {
     // Send money Page title
    SendMoneyTitle: {
        type: 'testId',
        value: 'send-money-page-title'
    },
    // Send money page From account label
    FromAccountLabel: {
        type: 'css',
        value: 'label[for="send-from-trigger"]'
    },   
     // Send money page From account dropdown
    FromAccountDropDown: {
        type: 'testId',
        value: 'send-from-account-select'
    },
     // Send money page Payee label
    PayeeLabel: {
        type: 'css',
        value: 'label[for="payee-select-trigger"]'
    }, 
     // Send money page Payee dropdown
    PayeeDropDown: {
        type: 'testId',
        value: 'send-payee-select'
    },
     //  Amount label
    AmountLabel: {
        type: 'css',
        value: 'label[for="send-amount"]'
    },
     //  Amount value
    AmountValue: {
        type: 'testId',
        value: 'send-amount-input'
    },
    // Note (optional) label
    NoteLabel: {
        type: 'css',
        value: 'label[for="send-note"]'
    },
    // Note (optional) input field
    NoteValue: {
        type: 'testId',
        value: 'send-note-input'
    },
    // Review & Send button
    ReviewSendButton: {
        type: 'testId',
        value: 'review-send-btn'
    },
    // Cancel button
    CancelButton: {
        type: 'testId',
        value: 'cancel-send-btn'
    },
    // Add Payee button
    AddPayeeButton: {
        type: 'testId',
        value: 'add-payee-btn'
    },
};
export default SendMoneyPageSelectors;