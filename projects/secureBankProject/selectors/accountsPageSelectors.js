export const accountPageSelectors = {
    accountMenuLink: {
        type: 'role',
        role: 'link',
        name: 'Accounts'
    },

    accountPageTitle: {
        type: 'text',
        value: 'My Accounts'
    },

    addAccountButton: {
        type: 'role',
        role: 'button',
        name: 'Add Account'
    },

    accountTable: {
        type: 'css',
        value: 'table'
    },

    accountRows: {
        type: 'css',
        value: 'tbody tr'
    },

    activeStatus: {
        type: 'text',
        value: 'Active'
    },

    viewButton: {
        type: 'text',
        value: 'View'
    },
     accountTitle: {
        type: 'text',
        value: 'My Accounts'
    },
    // added by vivek
    checkingAccount: {
        type: 'text',
        value: 'Everyday Checking'
    },
    

    accountBalance: {
        type: 'css',
        value: 'table'
    },
    checkingAccount: {
         type: 'text',
         value: 'Everyday Checking'
},
    savingsAccount: {
        type: 'text',
        value: 'High-Yield Savings'
}
//end here
};

export default accountPageSelectors;