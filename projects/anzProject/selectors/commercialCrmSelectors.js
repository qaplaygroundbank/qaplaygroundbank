const customerTable = {
    type: 'role',
    role: 'table',
    name: 'Commercial customer directory',
    exact: true
};

const customerDetails = {
    type: 'role',
    role: 'region',
    name: 'Customer details',
    exact: true
};

const commercialCrmSelectors = {
    heading: {
        type: 'role',
        role: 'heading',
        name: 'ANZ Commercial CRM Demo',
        exact: true
    },
    searchInput: {
        type: 'role',
        role: 'searchbox',
        name: 'Search customers',
        exact: true
    },
    segmentFilter: {
        type: 'role',
        role: 'combobox',
        name: 'Customer segment',
        exact: true
    },
    customerTable,
    customerRows: {
        type: 'css',
        value: 'tbody tr',
        within: customerTable
    },
    businessNameHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Business name',
        exact: true,
        within: customerTable
    },
    customerIdHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Customer ID',
        exact: true,
        within: customerTable
    },
    segmentHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Segment',
        exact: true,
        within: customerTable
    },
    relationshipManagerHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Relationship manager',
        exact: true,
        within: customerTable
    },
    statusHeader: {
        type: 'role',
        role: 'columnheader',
        name: 'Status',
        exact: true,
        within: customerTable
    },
    emptyState: {
        type: 'id',
        value: 'empty-state'
    },
    customerDetails,
    customerDetailsHeading: {
        type: 'role',
        role: 'heading',
        name: 'Customer details',
        exact: true,
        within: customerDetails
    },
    customerIdDetail: {
        type: 'css',
        value: '[data-field="customerId"]',
        within: customerDetails
    },
    segmentDetail: {
        type: 'css',
        value: '[data-field="segment"]',
        within: customerDetails
    },
    relationshipManagerDetail: {
        type: 'css',
        value: '[data-field="relationshipManager"]',
        within: customerDetails
    },
    statusDetail: {
        type: 'css',
        value: '[data-field="status"]',
        within: customerDetails
    },
    industryDetail: {
        type: 'css',
        value: '[data-field="industry"]',
        within: customerDetails
    },
    regionDetail: {
        type: 'css',
        value: '[data-field="region"]',
        within: customerDetails
    },
    closeDetailsButton: {
        type: 'role',
        role: 'button',
        name: 'Close customer details',
        exact: true,
        within: customerDetails
    }
};

export default commercialCrmSelectors;
