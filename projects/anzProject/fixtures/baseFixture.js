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
    }
});

export { expect };
