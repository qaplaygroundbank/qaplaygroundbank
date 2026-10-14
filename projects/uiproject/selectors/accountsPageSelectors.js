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
        type: 'locator',
        value: 'table'
    },

    accountRows: {
        type: 'locator',
        value: 'tbody tr'
    },

    activeStatus: {
        type: 'text',
        value: 'Active'
    },

    viewButton: {
        type: 'text',
        value: 'View'
    }
};

export default accountPageSelectors;
