import BasePage from './BasePage.js';
import commercialCrmSelectors from '../selectors/commercialCrmSelectors.js';
import { resolveLocator } from '../utils/locatorResolver.js';

class CommercialCrmPage extends BasePage {
    constructor(page) {
        super(page);
        this.heading = resolveLocator(page, commercialCrmSelectors.heading);
        this.searchInput = resolveLocator(page, commercialCrmSelectors.searchInput);
        this.segmentFilter = resolveLocator(page, commercialCrmSelectors.segmentFilter);
        this.customerTable = resolveLocator(page, commercialCrmSelectors.customerTable);
        this.customerRows = resolveLocator(page, commercialCrmSelectors.customerRows);
        this.businessNameHeader = resolveLocator(page, commercialCrmSelectors.businessNameHeader);
        this.customerIdHeader = resolveLocator(page, commercialCrmSelectors.customerIdHeader);
        this.segmentHeader = resolveLocator(page, commercialCrmSelectors.segmentHeader);
        this.relationshipManagerHeader = resolveLocator(page, commercialCrmSelectors.relationshipManagerHeader);
        this.statusHeader = resolveLocator(page, commercialCrmSelectors.statusHeader);
        this.emptyState = resolveLocator(page, commercialCrmSelectors.emptyState);
        this.customerDetails = resolveLocator(page, commercialCrmSelectors.customerDetails);
        this.customerDetailsHeading = resolveLocator(page, commercialCrmSelectors.customerDetailsHeading);
        this.customerIdDetail = resolveLocator(page, commercialCrmSelectors.customerIdDetail);
        this.segmentDetail = resolveLocator(page, commercialCrmSelectors.segmentDetail);
        this.relationshipManagerDetail = resolveLocator(page, commercialCrmSelectors.relationshipManagerDetail);
        this.statusDetail = resolveLocator(page, commercialCrmSelectors.statusDetail);
        this.industryDetail = resolveLocator(page, commercialCrmSelectors.industryDetail);
        this.regionDetail = resolveLocator(page, commercialCrmSelectors.regionDetail);
        this.closeDetailsButton = resolveLocator(page, commercialCrmSelectors.closeDetailsButton);
    }

    async searchCustomers(searchText) {
        await this.searchInput.fill(searchText);
    }

    async filterBySegment(segment) {
        await this.segmentFilter.selectOption({ label: segment });
    }

    async getSegmentOptions() {
        return this.segmentFilter.locator('option').allTextContents();
    }

    async openCustomerDetails(customerId) {
        const customerRow = this.customerRows.filter({ hasText: customerId });
        await customerRow.getByRole('button', { name: 'View details' }).click();
    }

    async closeCustomerDetails() {
        await this.closeDetailsButton.click();
    }
}

export default CommercialCrmPage;
