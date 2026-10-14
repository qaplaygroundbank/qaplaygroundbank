const transferPageSelectors = {

  // Page header & description

  pageHeading: {
    type: 'role',
    role: 'heading',
    name: 'Transfer Money',

  },
  subHeading: {
    type: 'text',
    value: 'Move funds between your accounts',
  },

  // From Account dropdown
  fromAccountSelect: {
    type: 'role',
    role: 'combobox',
    name: 'From Account',
  },

  // To Account dropdown

  toAccountSelect: {
    type: 'role',
    role: 'combobox',
    name: 'To Account',
  },

  // Amount input

  amountInput: {
    type: 'role',
    role: 'spinbutton',
    name: 'Amount',
  },

  // Memo (optional) input

  memoInput: {
    type: 'role',
    role: 'textbox',
    name: 'Memo (optional)',
  },

  // Transfer Date radio options
  transferDateTodayRadio: {
    type: 'role',
    role: 'radio',
    name: 'Today',
  },

  transferDateScheduleRadio: {
    type: 'role',
    role: 'radio',
    name: 'Schedule for later',

  },

  // Action buttons
  reviewTransferButton: {
    type: 'role',
    role: 'button',
    name: 'Review Transfer',

  },

  cancelButton: {

    type: 'role',

    role: 'button',

    name: 'Cancel',

  },

  // Left navigation items

  navTransfer: {

    type: 'role',

    role: 'link',

    name: 'Transfer',

  },

  navDashboard: {

    type: 'role',

    role: 'link',

    name: 'Dashboard',

  },

  navAccounts: {

    type: 'role',

    role: 'link',

    name: 'Accounts',

  },

  navSendMoney: {

    type: 'role',

    role: 'link',

    name: 'Send Money',

  },

  navBillPay: {

    type: 'role',

    role: 'link',

    name: 'Bill Pay',

  },

  navTransactions: {

    type: 'role',

    role: 'link',

    name: 'Transactions',

  },

  navApplyLoan: {

    type: 'role',

    role: 'link',

    name: 'Apply Loan',

  },

  navNotifications: {

    type: 'role',

    role: 'link',

    name: 'Notifications',

  },

  navProfile: {

    type: 'role',

    role: 'link',

    name: 'Profile',

  },

  navTestCases: {
    type: 'role',
    role: 'link',
    name: 'Test Cases',
  },
  confirmTransferButton: {
    type: 'role',
    role: 'button',
    name: 'Confirm Transfer',
  },

  memoInput: {
    type: 'testId',
    value:'transfer_memo_field',
  },

};

export default  transferPageSelectors ;