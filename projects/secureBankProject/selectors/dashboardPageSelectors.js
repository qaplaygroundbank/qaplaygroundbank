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
    // The actual username label inside the sidebar user card:
    // <span class="truncate text-xs text-slate-600 ...">standard_user</span>
    // (userInfo also contains the avatar initials, e.g. "ST", so exact-match
    // assertions must use this, not the whole userInfo container).
    sidebarUsername: {
        type: 'css',
        value: '[data-testid="sidebar-user-info"] span.truncate'
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
    },
    // Visible blocking-error alerts, excluding the Next.js route announcer
    // (`#__next-route-announcer__`, e.g. "Welcome back, Alex") which is also
    // role="alert" but is not an error.
    blockingErrorAlert: {
        type: 'css',
        value: '[role="alert"]:not(#__next-route-announcer__)'
    }
};

export default dashboardPageSelectors;
