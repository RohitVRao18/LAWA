import { expect, Page } from "@playwright/test";

export class RegistrationPage {
  constructor(private readonly page: Page) {}

  emailInput() {
    return this.page.getByLabel(/email/i);
  }

  sendVerificationCodeButton() {
    return this.page.getByRole("button", {
      name: /send.*verification.*code/i,
    });
  }

  verificationCodeInput() {
    return this.page.getByRole("textbox", {
      name: "Verification Code",
    });
  }

  verifyCodeButton() {
    return this.page.getByRole("button", {
      name: "Verify code",
      exact: true,
    });
  }

  newPasswordInput() {
    return this.page.locator("#newPassword");
  }

  reenterPasswordInput() {
    return this.page.locator("#reenterPassword");
  }

  createButton() {
    return this.page.getByRole("button", {
      name: "Create",
      exact: true,
    });
  }

  async enterEmail(email: string) {
    await this.emailInput().fill(email);
  }

  async requestVerificationCode() {
    await this.sendVerificationCodeButton().click();
  }

  async enterVerificationCode(code: string) {
    await this.verificationCodeInput().fill(code);
  }

  async verifyEmail(code: string) {
    await this.enterVerificationCode(code);
    await this.verifyCodeButton().click();
  }

  async createAccount(password: string) {
    await this.newPasswordInput().fill(password);
    await this.reenterPasswordInput().fill(password);

    await this.createButton().click();

    await expect(this.page).toHaveURL(
      /test\.jobsatlax\.org|jobsatlax\.org/i
    );
  }
}
