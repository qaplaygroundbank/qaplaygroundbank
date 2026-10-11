// pages/DashboardPage.js
import BasePage from './BasePage.js';
 
// Page object for the SecureBank dashboard (/bank/dashboard)
class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    // Locators use the app's data-testid attributes
    this.dashboardRoot = page.getByTestId('bank-dashboard-page');
    this.netWorthValue = page.getByTestId('stat-card-net-worth-value');
    // Sidebar links, used to move between Dashboard and Accounts
    this.dashboardLink = page.getByTestId('sidebar-link-dashboard');
    this.accountsLink = page.getByTestId('sidebar-link-accounts');
  }
 
  // Returns the Total Net Worth text as displayed, for example "$907.82"
  async getNetWorthText() {
    await this.netWorthValue.waitFor();
    return (await this.netWorthValue.innerText()).trim();
  }
 
  // Converts display text to a number; fails clearly if the text holds no amount
  static toNumber(text) {
    const value = parseFloat(String(text ?? '').replace(/[^\d.]/g, ''));
    if (Number.isNaN(value)) {
      throw new Error(`Cannot read an amount from "${text}"`);
    }
    return /-|\(/.test(text) ? -value : value;
  }
 
  // Builds the expected display text from a number, using the currency settings in dashboardData.json
  static formatCurrency(value, currency) {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
    }).format(value);
  }
}
 
export default DashboardPage;