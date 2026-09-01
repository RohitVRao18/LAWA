import { Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  welcomeMessage = () => this.page.locator('#WelcomeContent');
  errorMessage = () => this.page.getByText('Invalid username or password. Signon failed.');
  
  fishLink = () =>
    this.page.locator('img[src*="fish_icon"]');

  fishHeading = () =>
    this.page.getByRole('heading', { name: 'Fish' });

  fishProduct = () =>
    this.page.getByText('FI-SW-01');



  async verifyLoginSuccess() {
    await expect(this.welcomeMessage()).toContainText('Welcome');
  }

  async verifyInvalidLogin() {
    await expect(this.errorMessage()).toBeVisible();
    await expect(this.errorMessage()).toContainText(
      'Invalid username or password. Signon failed.'
    );
  }

  
async clickFishText() {
    await expect(this.fishLink()).toBeVisible();
    await this.fishLink().click();
  }

  
async verifyFishPageNavigation() {
    await expect(this.page).toHaveURL(/categoryId=FISH/);
    await expect(this.fishHeading()).toBeVisible();
    await expect(this.fishProduct()).toBeVisible();
  }

}