async function waitForPageLoaded(page, Header) {
    await page.waitForLoadState('networkidle');
    await Header.waitFor({ state: 'visible' });
}

async function attachScreenshot(testInfo, page, name) {
    await testInfo.attach(name, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
    });
}

export { waitForPageLoaded, attachScreenshot };
