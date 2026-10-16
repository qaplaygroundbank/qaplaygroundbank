// Helpers for validating application currency values against a configured
// currency and locale instead of assuming a hard-coded format.

/**
 * Build a currency formatter from the app's configured currency + locale.
 * @param {{ currency: string, locale: string }} appConfig
 * @returns {Intl.NumberFormat}
 */
export function createCurrencyFormatter(appConfig) {
  return new Intl.NumberFormat(appConfig.locale, {
    style: 'currency',
    currency: appConfig.currency
  });
}

/**
 * Extract the signed numeric value from a formatted currency string such as
 * "$1,234.56", "+$20.00" or "-$50.00". Returns a Number (may be negative, and
 * may be NaN if the string does not contain a parsable amount).
 * @param {string} displayed
 * @returns {number}
 */
export function parseCurrencyValue(displayed) {
  return Number(String(displayed).replace(/[^0-9.\-]/g, ''));
}

/**
 * True when the displayed magnitude matches what the configured locale/currency
 * would produce for that amount. The sign is ignored so both "-$50.00" and
 * "$-50.00" style negatives are accepted.
 * @param {string} displayed
 * @param {Intl.NumberFormat} formatter
 * @returns {boolean}
 */
export function matchesCurrencyFormat(displayed, formatter) {
  const numeric = parseCurrencyValue(displayed);
  if (Number.isNaN(numeric)) {
    return false;
  }

  const expectedMagnitude = formatter.format(Math.abs(numeric));
  const displayedMagnitude = String(displayed).replace(/[+-]/g, '');
  return displayedMagnitude === expectedMagnitude;
}
