import { Page } from '@playwright/test';

export class LandingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  enterStoreLink = () => this.page.getByRole('link', { name: 'Enter the Store' });


  async open(baseURL: string) {
    await this.page.goto(baseURL);
  }

  async clickEnterStore() {
    await this.enterStoreLink().click();
  }
}