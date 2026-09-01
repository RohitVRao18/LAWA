import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ENV } from "../config/env";
import { userData } from "../testdata/userData";
import { MailtrapHelper } from "../utils/mailtrapHelper";

test.setTimeout(120000);

test("Navigate to the job portal login page", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate(ENV.portalURL);

  await expect(page).toHaveURL(/test\.jobsatlax\.org/);
  await expect(loginPage.loginRegisterButton()).toBeVisible();

  await page.waitForTimeout(1000);
  await loginPage.clickLoginRegister();

  await page.waitForNavigation({ timeout: 10000 }).catch(() => {});

  await expect(page).toHaveURL(/b2clogin\.com.*oauth2\/v2\.0\/authorize/i);

  await expect(loginPage.signUpAsJobSeekerLink()).toBeVisible();
  await loginPage.clickSignUpAsJobSeeker();

  const email = userData.getNewUserEmail();

  await page.getByLabel(/email/i).fill(email);

  await page
    .getByRole("button", {
      name: /send.*verification.*code/i,
    })
    .click();

  const mailiskLink = `https://app.mailisk.net/inbox/${process.env.MAILISK_NAMESPACE}?email=${email}`;

  console.log(`\nVerification code sent to: ${email}`);
  console.log(`\nMailisk inbox: ${mailiskLink}`);
  console.log(`\nTrying Mailisk API retrieval...`);

  const password = "Password@123";

  const completeRegistration = async () => {
    await page.locator("#newPassword").fill(password);

    await page.locator("#reenterPassword").fill(password);

    await page
      .getByRole("button", {
        name: "Create",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(/test\.jobsatlax\.org|jobsatlax\.org/i, {
      timeout: 5000,
    });
  };

  const completeProfile = async () => {
    await page.getByLabel("First Name*").fill("Jagdeesh");

    await page.getByLabel("Last Name*").fill("W");

    await page.getByLabel("Phone*").fill("035-432-4234");

    await page.getByLabel("Zip Code*").fill("90040");

    await page
      .getByLabel("Are you between the ages of 18 to 24?")
      .selectOption({
        label: "No",
      });

    await page
      .getByLabel("How did you find out about www.jobsatlax.org?*")
      .selectOption({
        label: "Social Media",
      });

    const referralSource = "Other";

    await page.getByLabel("Referral source").selectOption({
      label: referralSource,
    });

    if (referralSource === "Other") {
      await page
        .getByLabel("Please specify the referral source*")
        .fill("TestingTestingTesting");
    }

    const age = Math.floor(Math.random() * 56) + 25;

    await page.locator("#age").fill(String(age));

    console.log(`\nRandom age selected: ${age}`);

    await page
      .getByRole("radio", {
        name: "Male",
        exact: true,
      })
      .check();

    await page
      .getByRole("radio", {
        name: "Yes",
        exact: true,
      })
      .first()
      .check();

    await page
      .getByRole("radio", {
        name: "No",
        exact: true,
      })
      .nth(1)
      .check();

    await page
      .getByRole("radio", {
        name: "Hispanic or Latino",
        exact: true,
      })
      .check();

    await page
      .getByRole("radio", {
        name: "Native Hawaiian or Other Pacific Islander",
        exact: true,
      })
      .check();

    await page.setInputFiles(
      'input[type="file"]',
      "C:\\LAWA\\testdata\\profile-photo.png",
    );

    await page
      .getByRole("button", {
        name: "Save Changes",
        exact: true,
      })
      .click();

    console.log("\nProfile details saved.");
  };

  try {
    const mailtrap = new MailtrapHelper();

    const verificationCode = await mailtrap.getVerificationCode(email);

    console.log(`\nCode retrieved automatically: ${verificationCode}`);

    await page.getByLabel(/verification.*code|code/i).fill(verificationCode);

    await page
      .getByRole("button", {
        name: /verify|submit/i,
      })
      .click();

    await completeRegistration();
    await completeProfile();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.log(`\nMailisk API failed: ${message}`);
    console.log(
      `\nPlease open the inbox above, copy the verification code, paste it manually, then click Verify/Submit.`,
    );
    console.log(
      `\nThe test will pause here. After verification, resume the test and password + Create will be automated.`,
    );

    await page.pause();
    await completeRegistration();
    await completeProfile();
  }

  // Store registered user credentials for login test
  userData.setRegisteredUser(email, password);

  console.log(`\n--- REGISTERED USER STORED ---`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Stored data: ${JSON.stringify(userData.getRegisteredUser())}`);
  console.log(`--- END STORAGE ---\n`);

  console.log(`\nRegistration and profile details completed.`);
});

test("Login with registered user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const registeredUser = userData.getRegisteredUser();

  // Check if user was registered in previous test
  if (!registeredUser.email || registeredUser.email === "") {
    console.log(
      `\nNo registered user found. Please run the registration test first.`,
    );
    console.log(`Using valid test user as fallback for demonstration.`);
    registeredUser.email = userData.validUser.username;
    registeredUser.password = userData.validUser.password;
  }

  const email = registeredUser.email;
  const password = registeredUser.password;

  console.log(`\nLogging in with user: ${email}`);
  console.log(`Password being used: ${password}`);

  // Navigate to the job portal
  await loginPage.navigate(ENV.portalURL);

  await expect(page).toHaveURL(/test\.jobsatlax\.org/);
  await expect(loginPage.loginRegisterButton()).toBeVisible();

  // Click Login/Register button
  await page.waitForTimeout(1000);
  await loginPage.clickLoginRegister();

  // Handle navigation to auth page
  await page.waitForNavigation({ timeout: 10000 }).catch(() => {});

  try {
    // Verify we're on the sign-in form
    await expect(loginPage.usernameInput()).toBeVisible({
      timeout: 5000,
    });

    console.log(`\nSign-in form found. Attempting to fill credentials...`);

    // Fill in username and password directly
    await loginPage.usernameInput().fill(email);
    await loginPage.passwordInput().fill(password);

    console.log(`\nCredentials filled. Clicking Sign in button...`);

    await loginPage.loginButton().click();

    // Wait for navigation after login
    await page.waitForNavigation({ timeout: 10000 }).catch(() => {});

    // Verify successful login - should be redirected to home/dashboard
    const currentUrl = page.url();
    console.log(`\nCurrent URL after login: ${currentUrl}`);

    await expect(page).toHaveURL(/test\.jobsatlax\.org|jobsatlax\.org/i, {
      timeout: 5000,
    });

    console.log(`Login successful for user: ${email}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log(`Login failed: ${message}`);
    console.log(`Email used: ${email}`);
    console.log(`Password used: ${password}`);
    console.log(`Current URL: ${page.url()}`);
    throw error;
  }
  await page.pause();
});
