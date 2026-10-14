const dashboardPageSelectors = {
    dashboardContainer: {
        type: 'testId',
        value: 'bank-dashboard-page'
    },
    welcomeMessage: {
        type: 'testId',
        value: 'dashboard-welcome-message'
    },
    userInfo: {
        type: 'testId',
        value: 'sidebar-user-info'
    },
    statCards: {
        type: 'testId',
        value: 'dashboard-stat-cards'
    },
    // Generic test id shared by every statistic card in the section.
    statCard: {
        type: 'testId',
        value: 'stat-card'
    },
    quickActions: {
        type: 'testId',
        value: 'quick-actions-section'
    },
    recentTransactions: {
        type: 'testId',
        value: 'recent-transactions-section'
    },
    logoutButton: {
        type: 'testId',
        value: 'topbar-logout-btn'
    },
    // The page keeps an empty alert region, so this is filtered to alerts that
    // actually contain text in the page object.
    errorMessage: {
        type: 'role',
        role: 'alert'
    }
};

export default dashboardPageSelectors;
