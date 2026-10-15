const transferPageSelectors = {
  // Navigation Menu
  navTransfer: {
    type: 'role',
    role: 'link',
    name: 'Transfer',
  },
 
  // Page Heading
  pageHeading: {
    type: 'role',
    role: 'heading',
    name: 'Transfer Money',
  },
 
  // Dropdown Selectors
  fromAccountSelect: {
    type: 'role',
    role: 'combobox',
    name: 'From Account',
  },
  toAccountSelect: {
    type: 'role',
    role: 'combobox',
    name: 'To Account',
  },
 
  // Amount & Memo Inputs
  amountInput: {
    type: 'role',
    role: 'spinbutton',
    name: 'Amount',
  },
  memoInput: {
    type: 'role',
    role: 'textbox',
    name: 'Memo (optional)',
  },
 
  // Date Radio Options
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
 
  // Buttons & Modal Actions
  reviewTransferButton: {
    type: 'role',
    role: 'button',
    name: 'Review Transfer',
  },
  confirmTransferButton: {
    type: 'role',
    role: 'button',
    name: 'Confirm Transfer',
  },
  cancelButton: {
    type: 'role',
    role: 'button',
    name: 'Cancel',
  },
 
  // Status Notification
  successMessage: {
    type: 'testId',
    value: 'transfer-success-heading',
  },
  amountErrorMessage: {
    type: 'testId',
    value: 'transfer-error-message',
  },
};
 
export default transferPageSelectors;