// Pattern used to pick out balance-bearing account summary cards on the
// dashboard. It matches cards whose text contains a currency symbol next to a
// number, so unrelated statistic cards (counts, percentages, etc.) are excluded
// even if they reuse the generic `stat-card` test id. This keeps the expected
// account-summary card count reliable if the dashboard adds other stat cards.
const CURRENCY_BALANCE_PATTERN = /[$€£¥₹₽₩]\s?-?\d/;

import { resolveLocator } from '../utils/locatorResolver.js';
import dashboardSelectors from '../selectors/dashboardPageSelectors.js';

// Page object for the SecureBank dashboard shown after login.
class DashboardPage {
  constructor(page) {
    this.page = page;

    this.dashboardContainer = resolveLocator(page, dashboardSelectors.dashboardContainer);
    this.welcomeMessage = resolveLocator(page, dashboardSelectors.welcomeMessage);
    this.userInfo = resolveLocator(page, dashboardSelectors.userInfo);
    this.statCards = resolveLocator(page, dashboardSelectors.statCards);
    // Every statistic card in the section (generic `stat-card` test id).
    this.statCardItems = this.statCards.getByTestId(dashboardSelectors.statCard.value);
    // Only the account summary cards: the balance-bearing ones. Filtering here
    // means adding a non-balance statistic card will not change this count.
    this.accountSummaryCards = this.statCardItems.filter({
      hasText: CURRENCY_BALANCE_PATTERN
    });
    this.quickActions = resolveLocator(page, dashboardSelectors.quickActions);
    this.recentTransactions = resolveLocator(page, dashboardSelectors.recentTransactions);
    this.logoutButton = resolveLocator(page, dashboardSelectors.logoutButton);

    // Only alerts that actually contain text (the page also has an empty alert region)
    this.errorMessage = resolveLocator(page, dashboardSelectors.errorMessage).filter({
      hasText: /\S/
    });
  }


  // Each card renders its label in the first <p> and its value in the second <p>.
  accountSummaryLabel(card) {
    return card.locator('p').first();
  }

  accountSummaryValue(card) {
    return card.locator('p').nth(1);
  }

  // Locate a single account summary card by its visible label (e.g. "Net Worth").
  accountSummaryCardByLabel(label) {
    return this.accountSummaryCards.filter({ hasText: label });
  }

  // Convenience accessor for a labelled card's value locator.
  accountSummaryValueByLabel(label) {
    return this.accountSummaryValue(this.accountSummaryCardByLabel(label));
  }

  async isAccountSummaryValueDisplayedWithoutOverlap(value) {
    return value.evaluate(element => {
      const card = element.closest('[data-testid="stat-card"]');
      if (!card) {
        return false;
      }

      const valueRect = element.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const fitsCard =
        element.scrollWidth <= element.clientWidth &&
        element.scrollHeight <= element.clientHeight &&
        valueRect.left >= cardRect.left &&
        valueRect.right <= cardRect.right &&
        valueRect.top >= cardRect.top &&
        valueRect.bottom <= cardRect.bottom;

      const otherTextElements = Array.from(card.querySelectorAll('*')).filter(
        candidate =>
          candidate !== element &&
          !candidate.contains(element) &&
          !element.contains(candidate) &&
          Array.from(candidate.childNodes).some(
            node => node.nodeType === 3 && node.textContent.trim()
          )
      );
      const doesNotOverlapText = otherTextElements.every(candidate => {
        const otherRect = candidate.getBoundingClientRect();
        if (otherRect.width === 0 || otherRect.height === 0) {
          return true;
        }

        return (
          valueRect.right <= otherRect.left ||
          valueRect.left >= otherRect.right ||
          valueRect.bottom <= otherRect.top ||
          valueRect.top >= otherRect.bottom
        );
      });

      return fitsCard && doesNotOverlapText;
    });
  }
}

export default DashboardPage;
