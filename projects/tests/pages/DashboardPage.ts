import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async assertLoaded() {
    await this.page.waitForURL(/\/bank\/dashboard$/);
    await this.page.getByText('Welcome back, Alex').waitFor({ state: 'visible' });
    await this.page.getByText('Total Net Worth').waitFor({ state: 'visible' });
  }
}
