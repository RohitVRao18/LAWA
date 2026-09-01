import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Login/Register in the top navigation; there is also a lower CTA button with the same label.
  loginRegisterButton = () =>
    this.page.locator('nav').getByRole('button', { name: 'Login / Register' }).first();

  // Azure B2C sign-up choice on the auth page
  signUpAsJobSeekerLink = () =>
    this.page.getByRole('link', { name: /sign\s*up\s*as\s*job\s*seeker/i }).first();

  // Fallback selectors if the app navigates to a separate sign-in page
  signOnLink = () => this.page.getByRole('link', { name: 'Sign In' });
  usernameInput = () => this.page.getByRole('textbox', { name: 'Email Address' });
  passwordInput = () => this.page.getByRole('textbox', { name: 'Password' });
  loginButton = () => this.page.getByRole('button', { name: /sign\s*in/i });

  async navigate(baseURL: string) {
    await this.page.goto(baseURL);
  }

  async clickLoginRegister() {
    await this.loginRegisterButton().click();
  }

  async clickSignUpAsJobSeeker() {
    await this.signUpAsJobSeekerLink().click();
  }

  async clickSignOn() {
    await this.signOnLink().click();
  }

  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  


}