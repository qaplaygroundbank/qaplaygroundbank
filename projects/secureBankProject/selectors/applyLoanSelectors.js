const applyLoanSelectors = {
    loanHeader: {
        type: 'testId',
        value: 'apply-loan-page'
    },
    dashboardLink: {
        type: 'testId',
        value: 'sidebar-link-dashboard'
    },
    applyLoanNavigationLink: {
        type: 'testId',
        value: 'sidebar-link-apply-loan'
    },
    pageTitle: {
        type: 'testId',
        value: 'apply-loan-page-title'
    },
    pageBody: {
        type: 'css',
        value: 'body'
    },
    amountInput: {
        type: 'css',
        value: 'input[name="amount"]'
    },
    downPaymentInput: {
        type: 'css',
        value: 'input[name="downPayment"]'
    },
    fromAccountSelect: {
        type: 'css',
        value: 'select[name="fromAccountId"]'
    },
    applyButton: {
        type: 'role',
        role: 'button',
        name: 'Apply',
        exact: false
    },
    loanDialog: {
        type: 'testId',
        value: 'apply-loan-dialog'
    },
    dialogTitle: {
        type: 'testId',
        value: 'apply-loan-dialog-title'
    },
    loanTypeLabel: {
        type: 'css',
        value: 'label[for="loan-type-trigger"]'
    },
    loanAmountLabel: {
        type: 'css',
        value: 'label[for="loan-amount"]'
    },
    termLengthLabel: {
        type: 'css',
        value: 'label[for="loan-term-trigger"]'
    },
    interestRateLabel: {
        type: 'css',
        value: 'label[for="loan-interest-rate"]'
    },
    accountLabel: {
        type: 'css',
        value: 'label[for="loan-account-trigger"]'
    },
    purposeLabel: {
        type: 'text',
        value: 'Purpose'
    },
    loanTypeDropdown: {
        type: 'testId',
        value: 'loan-type-select'
    },
    loanAmountInput: {
        type: 'testId',
        value: 'loan-amount-input'
    },
    termLengthDropdown: {
        type: 'testId',
        value: 'loan-term-select'
    },
    interestRateInput: {
        type: 'testId',
        value: 'loan-interest-rate-input'
    },
    accountDropdown: {
        type: 'testId',
        value: 'loan-account-select'
    },
    purposeTextarea: {
        type: 'css',
        value: 'textarea[name="loan_purpose_field"]'
    },
    reviewBtn: {
        type: 'testId',
        value: 'review-loan-btn'
    },
    cancelBtn: {
        type: 'testId',
        value: 'cancel-loan-btn'
    },
    closeBtn: {
        type: 'role',
        role: 'button',
        name: 'Close'
    },
    openApplyLoanBtn: {
        type: 'testId',
        value: 'open-apply-loan-btn'
    }
};

export default applyLoanSelectors;