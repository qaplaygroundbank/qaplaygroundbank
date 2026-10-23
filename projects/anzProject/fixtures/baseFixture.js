import { readFile } from 'node:fs/promises';
import { test as base, expect } from '@playwright/test';
import CommercialCrmPage from '../pages/CommercialCrmPage.js';
import commercialCrmData from '../testData/commercialCrmData.json' with { type: 'json' };

const demoHtmlPath = new URL('../testData/commercialCrmDemo.html', import.meta.url);

export const test = base.extend({
    crmPage: async ({ page }, use) => {
        const demoHtml = await readFile(demoHtmlPath, 'utf8');
        await page.setContent(
            demoHtml.replace(
                /(?<=<script id="crm-test-data" type="application\/json">)[\s\S]*?(?=<\/script>)/,
                JSON.stringify(commercialCrmData.customers)
            )
        );
        await use(new CommercialCrmPage(page));
        const holdMilliseconds = Number(process.env.ANZ_TEST_HOLD_MS || 0);
        if (!Number.isFinite(holdMilliseconds) || holdMilliseconds < 0) {
            throw new Error(
                'ANZ_TEST_HOLD_MS must be a non-negative number of milliseconds.'
            );
        }
        if (holdMilliseconds > 0) {
            await page.waitForTimeout(holdMilliseconds);
        }
    }
});

export { expect };
