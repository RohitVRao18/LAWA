import { ENV } from '../config/env';
import { test } from '../fixtures/baseFixture';
import { HomePage } from '../pages/HomePage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { userData } from '../testdata/userData';

test('Verify login and home page', async ({ loggedInPage }) => {
  const homePage = new HomePage(loggedInPage);
  await homePage.verifyLoginSuccess();
});


test('Invalid login should show error message', async ({ page }) => {
  const landingPage = new LandingPage(page);
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  await landingPage.open(ENV.baseURL);
  await landingPage.clickEnterStore();
  await loginPage.clickSignOn();
  // SAME METHOD reused
  await loginPage.login(
    userData.invalidUser.username,
    userData.invalidUser.password
  );
  await homePage.verifyInvalidLogin();
});

test('Verify clicking Fish text navigates to Fish page', async ({ loggedInPage }) => {

  const homePage = new HomePage(loggedInPage);

  await homePage.clickFishText();
  await homePage.verifyFishPageNavigation();
});

