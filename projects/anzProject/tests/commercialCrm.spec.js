import { test, expect } from '../fixtures/baseFixture.js';
import commercialCrmData from '../testData/commercialCrmData.json' with { type: 'json' };

test.describe('ANZ Commercial CRM demo @crm @smoke', () => {
    test('Positive 1 - displays the customer directory and segment options', async ({ crmPage }) => {
        await expect(crmPage.heading).toBeVisible();
        await expect(crmPage.searchInput).toBeVisible();
        await expect(crmPage.segmentFilter).toBeVisible();
        await expect(crmPage.customerTable).toBeVisible();
        await expect(crmPage.businessNameHeader).toBeVisible();
        await expect(crmPage.customerIdHeader).toBeVisible();
        await expect(crmPage.segmentHeader).toBeVisible();
        await expect(crmPage.relationshipManagerHeader).toBeVisible();
        await expect(crmPage.statusHeader).toBeVisible();
        await expect(crmPage.customerRows).toHaveCount(
            commercialCrmData.customers.length
        );
        expect(await crmPage.getSegmentOptions()).toEqual(
            commercialCrmData.segments
        );
    });

    test('Positive 2 - searches customers by business name and customer ID', async ({ crmPage }) => {
        const customer = commercialCrmData.customers[2];

        await crmPage.searchCustomers(commercialCrmData.search.businessName);
        await expect(crmPage.customerRows).toHaveCount(1);
        await expect(crmPage.customerRows.first()).toContainText(
            customer.businessName
        );

        await crmPage.searchCustomers(commercialCrmData.search.customerId);
        await expect(crmPage.customerRows).toHaveCount(1);
        await expect(crmPage.customerRows.first()).toContainText(
            customer.customerId
        );
    });

    test('Positive 3 - search is case-insensitive and ignores surrounding whitespace', async ({ crmPage }) => {
        const customer = commercialCrmData.customers[2];
        await crmPage.searchCustomers('  brightpath TECHNOLOGIES  ');

        await expect(crmPage.customerRows).toHaveCount(1);
        await expect(crmPage.customerRows.first()).toContainText(
            customer.businessName
        );
    });

    test('Positive 4 - searches customers by relationship manager and industry', async ({ crmPage }) => {
        const customer = commercialCrmData.customers[1];

        await crmPage.searchCustomers(customer.relationshipManager);
        await expect(crmPage.customerRows).toHaveCount(1);
        await expect(crmPage.customerRows.first()).toContainText(
            customer.businessName
        );

        await crmPage.searchCustomers(customer.industry);
        await expect(crmPage.customerRows).toHaveCount(1);
        await expect(crmPage.customerRows.first()).toContainText(
            customer.businessName
        );
    });

    test('Positive 5 - filters customers by segment and restores all customers', async ({ crmPage }) => {
        await crmPage.filterBySegment('Corporate');
        await expect(crmPage.customerRows).toHaveCount(2);
        await expect(crmPage.customerRows.nth(0)).toContainText(
            commercialCrmData.customers[0].businessName
        );
        await expect(crmPage.customerRows.nth(1)).toContainText(
            commercialCrmData.customers[3].businessName
        );

        await crmPage.filterBySegment('All segments');
        await expect(crmPage.customerRows).toHaveCount(
            commercialCrmData.customers.length
        );
    });

    test('Negative 1 - combined search and segment filters show no unrelated customers', async ({ crmPage }) => {
        await crmPage.filterBySegment('Corporate');
        await crmPage.searchCustomers('Wattle');

        await expect(crmPage.customerRows).toHaveCount(1);
        await expect(crmPage.customerRows.first()).toContainText(
            commercialCrmData.customers[3].businessName
        );

        await crmPage.searchCustomers('Brightpath');
        await expect(crmPage.customerRows).toHaveCount(0);
        await expect(crmPage.emptyState).toBeVisible();
    });

    test('Positive 6 - opens and closes a customer record with its expected details', async ({ crmPage }) => {
        const customer = commercialCrmData.customers[1];
        await crmPage.openCustomerDetails(customer.customerId);

        await expect(crmPage.customerDetails).toBeVisible();
        await expect(crmPage.customerDetailsHeading).toBeVisible();
        await expect(crmPage.customerDetails).toContainText(
            customer.businessName
        );
        await expect(crmPage.customerIdDetail).toHaveText(customer.customerId);
        await expect(crmPage.segmentDetail).toHaveText(customer.segment);
        await expect(crmPage.relationshipManagerDetail).toHaveText(
            customer.relationshipManager
        );
        await expect(crmPage.statusDetail).toHaveText(customer.status);
        await expect(crmPage.industryDetail).toHaveText(customer.industry);
        await expect(crmPage.regionDetail).toHaveText(customer.region);

        await crmPage.closeCustomerDetails();
        await expect(crmPage.customerDetails).toBeHidden();
    });

    test('Negative 2 - shows an empty state for a search with no matches', async ({ crmPage }) => {
        await crmPage.searchCustomers(commercialCrmData.search.noMatch);

        await expect(crmPage.customerRows).toHaveCount(0);
        await expect(crmPage.emptyState).toBeVisible();
        await expect(crmPage.emptyState).toHaveText(
            commercialCrmData.expected.noResultsMessage
        );
    });

    test('Boundary 1 - clearing the search restores the full customer list', async ({ crmPage }) => {
        await crmPage.searchCustomers(commercialCrmData.search.businessName);
        await expect(crmPage.customerRows).toHaveCount(1);

        await crmPage.searchCustomers('');

        await expect(crmPage.customerRows).toHaveCount(
            commercialCrmData.customers.length
        );
        await expect(crmPage.emptyState).toBeHidden();
    });

    test('Negative 3 - punctuation-only search returns no customers', async ({ crmPage }) => {
        await crmPage.searchCustomers('!@#$%^&*');

        await expect(crmPage.customerRows).toHaveCount(0);
        await expect(crmPage.emptyState).toBeVisible();
        await expect(crmPage.emptyState).toHaveText(
            commercialCrmData.expected.noResultsMessage
        );
    });

    test('Negative 4 - unknown customer ID returns no customers', async ({ crmPage }) => {
        await crmPage.searchCustomers('DEMO-CUS-9999');

        await expect(crmPage.customerRows).toHaveCount(0);
        await expect(crmPage.emptyState).toBeVisible();
    });

    test('Boundary 2 - empty search displays the full directory', async ({ crmPage }) => {
        await crmPage.searchCustomers('');

        await expect(crmPage.customerRows).toHaveCount(
            commercialCrmData.customers.length
        );
        await expect(crmPage.emptyState).toBeHidden();
    });

    test('Boundary 3 - whitespace-only search is treated as an empty query', async ({ crmPage }) => {
        await crmPage.searchCustomers('   ');

        await expect(crmPage.customerRows).toHaveCount(
            commercialCrmData.customers.length
        );
        await expect(crmPage.emptyState).toBeHidden();
    });

    test('Boundary 4 - exact customer ID search returns only that record', async ({ crmPage }) => {
        const customer = commercialCrmData.customers[0];
        await crmPage.searchCustomers(customer.customerId);

        await expect(crmPage.customerRows).toHaveCount(1);
        await expect(crmPage.customerRows.first()).toContainText(
            customer.businessName
        );
        await expect(crmPage.customerRows.first()).toContainText(
            customer.customerId
        );
    });

    test('Boundary 5 - each segment filter only returns customers in that segment', async ({ crmPage }) => {
        const segments = commercialCrmData.segments.filter(
            (segment) => segment !== 'All segments'
        );

        for (const segment of segments) {
            await crmPage.filterBySegment(segment);
            const rowCount = await crmPage.customerRows.count();
            expect(rowCount).toBeGreaterThan(0);

            for (let index = 0; index < rowCount; index++) {
                await expect(
                    crmPage.customerRows.nth(index).locator('td').nth(2)
                ).toHaveText(segment);
            }
        }
    });
});
