import { test as base, Page, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { ENV } from '../config/env';
import { userData } from '../testdata/userData';

// Define fixture type
type MyFixtures = {
  loggedInPage: Page;
};

// Extend base test with typed fixture
export const test = base.extend<MyFixtures>({
  loggedInPage: async ({ page }: { page: Page }, use) => {

    const landingPage = new LandingPage(page);
    const loginPage = new LoginPage(page);

    // Step 1: Open URL
    await landingPage.open(ENV.baseURL);

    // Step 2: Enter Store
    await landingPage.clickEnterStore();

    // Step 3: Click Sign In
    await loginPage.clickSignOn();

    // Step 4: Login
    await loginPage.login(userData.validUser.username, userData.validUser.password);

    // Provide page after login
    await use(page);
  }
});

export { expect };