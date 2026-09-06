import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ENV } from "../config/env";
import { userData } from "../testdata/userData";
import { RegistrationPage } from "../pages/RegistrationPage";
import { ProfilePage } from "../pages/ProfilePage";
import dotenv from "dotenv";
import { MailiskService } from "../pages/services/MailiskService";
import { HomePage } from "../pages/HomePage";
dotenv.config();

test.setTimeout(120000);

test("Register a new job seeker and complete their profile", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const registrationPage = new RegistrationPage(page);
  const profilePage = new ProfilePage(page);

  const mailiskService = new MailiskService({
  apiKey: process.env.MAILISK_API_KEY!,
  namespace: process.env.MAILISK_NAMESPACE!,
});

  const email = userData.getNewUserEmail();
  const password = userData.credentials.password;
  const profile = userData.profile;

  // Navigate to job portal
  await loginPage.navigate(ENV.portalURL);

  await expect(page).toHaveURL(/test\.jobsatlax\.org/);
  await expect(loginPage.loginRegisterButton()).toBeVisible();

  // Navigate to Azure B2C registration
  await loginPage.clickLoginRegister();

  await expect(page).toHaveURL(
    /b2clogin\.com.*oauth2\/v2\.0\/authorize/i
  );

  await expect(loginPage.signUpAsJobSeekerLink()).toBeVisible();
  await loginPage.clickSignUpAsJobSeeker();

  // Enter email and request verification code
  await registrationPage.enterEmail(email);
  await registrationPage.requestVerificationCode();

  console.log(`\nVerification code sent to: ${email}`);

 try {
  const verificationCode =
    await mailiskService.getVerificationCode(email);

  console.log(
    `\nCode retrieved automatically: ${verificationCode}`
  );

  await registrationPage.verifyEmail(verificationCode);

} catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  console.log(`\nMailisk API failed: ${message}`);

  console.log(
    "\nPlease open the Mailisk inbox, copy the verification code, paste it manually, then click Verify/Submit."
  );

  console.log(
    "\nThe test will pause here. After verification, resume the test and password + Create will be automated."
  );

  await page.pause();
}

  // Complete account creation
  await registrationPage.createAccount(password);

  // Complete profile
  await profilePage.completeProfile(profile);

  // Store registered user credentials
  userData.setRegisteredUser(email, password);

  console.log(`\nRegistration and profile details completed.`);
await page.waitForTimeout(5000); // Wait for 2 seconds before proceeding
});

test("Login with registered user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const registeredUser = userData.getRegisteredUser();
  const profilePage = new ProfilePage(page);
  const homePage = new HomePage(page);

  const email = registeredUser.email;
  const password = registeredUser.password;

  console.log(`\nLogging in with user: ${email}`);

  // ============================================================
  // NAVIGATE TO JOB PORTAL
  // ============================================================

  await loginPage.navigate(ENV.portalURL);

  await expect(page).toHaveURL(/test\.jobsatlax\.org/);
  await expect(loginPage.loginRegisterButton()).toBeVisible();

  // ============================================================
  // LOGIN
  // ============================================================

  await loginPage.clickLoginRegister();

  try {
    await expect(loginPage.usernameInput()).toBeVisible({
      timeout: 5000,
    });

    console.log(
      `\nSign-in form found. Attempting to fill credentials...`
    );

    await loginPage.usernameInput().fill(email);
    await loginPage.passwordInput().fill(password);

    console.log(
      `\nCredentials filled. Clicking Sign in button...`
    );

    await loginPage.loginButton().click();

    

    console.log(`\nCurrent URL after login: ${page.url()}`);

    await expect(page).toHaveURL(
      /test\.jobsatlax\.org|jobsatlax\.org/i,
      {
        timeout: 10000,
      }
    );

    console.log(`\nLogin successful for user: ${email}`);

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.log(`Login failed: ${message}`);
    console.log(`Email used: ${email}`);
    console.log(`Current URL: ${page.url()}`);

    throw error;
  }

//   // ============================================================
//   // DIRECT RESUME UPLOAD
//   // ============================================================

//   const addResume = page.locator(".image-upload-wrapper");

//   await expect(addResume).toBeVisible({
//     timeout: 15000,
//   });

//   await addResume.click();

//   await page.locator('textarea[formcontrolname="summary"]').fill(
//     "Experienced professional with strong communication, teamwork, problem-solving, and technical skills."
//   );

//   const resumeName = page.locator(
//   'input[formcontrolname="resumeName"]'
// );

// await resumeName.fill(`Resume_${Date.now()}`);

// await expect(resumeName).toHaveValue(/.+/);

//   await page.locator('input[formcontrolname="jobTitle"]').fill(
//     "Software Tester"
//   );

//   await homePage.uploadResume("testdata/Resume.txt");

//   console.log("\nResume uploaded successfully.");

//   await homePage.publishResume();

// console.log("\nPublish button clicked.");

// await expect(
//   page.locator('textarea[formcontrolname="summary"]')
// ).toBeHidden({
//   timeout: 15000,
// });

// console.log("\nResume dialog closed after Publish.");


//   // ============================================================
//   // CLICK EXPLORE JOBS
//   // ============================================================

  await homePage.clickExploreAllJobs();

  console.log("\nClicked 'Explore All Jobs'.");

//   // ============================================================
//   // APPLY TO A JOB
//   // ============================================================

//   await homePage.clickApplyNow();

//   await homePage.clickApplicantName();

//   await homePage.clickApply();

//   await homePage.closeResumeDialog();

  // ============================================================
  // CLICK FIRST JOB
  // ============================================================

  await homePage.clickFirstJob();

  console.log("Clicked a job.");

  // ============================================================
  // SAVE JOB
  // ============================================================

  await homePage.clickSaveJob();

  console.log("Saved the job.");

  await homePage.closeJobDetails();

  console.log("Closed job details.");

  // ============================================================
  // SEARCH JOBS
  // ============================================================

  await homePage.searchJobTitle("security");

  // ============================================================
  // RANDOM EMPLOYMENT TYPE
  // ============================================================

  await homePage.selectRandomEmploymentType();

  // ============================================================
  // RANDOM JOB CATEGORY
  // ============================================================

  await homePage.selectRandomJobCategory();

  // ============================================================
  // SEARCH JOBS
  // ============================================================

  await homePage.clickSearchJobs();

  await expect(
    page.getByRole("status", {
      name: "Loading job results",
    })
  ).toBeHidden({
    timeout: 30000,
  });

  // ============================================================
  // CHECK FOR ZERO RESULTS
  // ============================================================

  const rangeText = await homePage.getSearchResultRange();

  console.log(`\nSearch result range: ${rangeText}`);

  if (/^0\s+of\s+0$/i.test(rangeText)) {
    console.log("\nNo jobs found for the selected filters.");

    await homePage.verifyNextPageDisabled();

    console.log("\nZero-results scenario handled.");

  } else {

    // ============================================================
    // RESULTS / PAGINATION
    // ============================================================

    const nextPageEnabled = await homePage.isNextPageEnabled();

    await homePage.verifyPreviousPageDisabled();

    if (nextPageEnabled) {
      console.log("\nNext page is available.");

      const firstPageRange =
        await homePage.getSearchResultRange();

      await homePage.clickNextPage();

      await page.waitForTimeout(1000);

      const secondPageRange =
        await homePage.getSearchResultRange();

      console.log(
        `\nAfter clicking Next: ${secondPageRange}`
      );

      // Make sure pagination actually changed
      expect(secondPageRange).not.toBe(firstPageRange);

      console.log("\nPagination is working correctly.");

    } else {
      console.log(
        "\nOnly one page of results. Next page is disabled."
      );
    }
  }

  // ============================================================
  // CLICK MY DASHBOARD
  // ============================================================

  const myDashboardLink = page.getByRole("link", {
    name: "My Dashboard",
    exact: true,
  });

  await expect(myDashboardLink).toBeVisible({
    timeout: 15000,
  });

  await myDashboardLink.click();

  console.log("\nClicked 'My Dashboard'.");

  await expect(page).toHaveURL(/dashboard\/jobseeker/i);

  console.log("\nSuccessfully navigated to My Dashboard.");

  // ============================================================
  // VIEW PROFILE
  // ============================================================

  const viewProfileButton = page.getByRole("button", {
    name: "View Profile",
    exact: true,
  });

  await expect(viewProfileButton).toBeVisible({
    timeout: 15000,
  });

  await viewProfileButton.click();

  console.log("\nClicked 'View Profile'.");

  await expect(page).toHaveURL(/profile\/candidate\/view/i);

  console.log("\nSuccessfully navigated to View Profile.");

  // ============================================================
  // EDIT PROFILE
  // ============================================================

  await profilePage.editProfile();

  console.log("\nClicked 'Edit Profile'.");

  // ============================================================
  // UPDATE PHONE AND ZIP CODE
  // ============================================================

  const newPhone = `035-${Math.floor(
    100 + Math.random() * 900
  )}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newZipCode = userData.profile.zipCode;

  await profilePage.updatePhoneAndZip(
    newPhone,
    newZipCode
  );

  // ============================================================
  // RETURN TO MY DASHBOARD
  // ============================================================

  await expect(myDashboardLink).toBeVisible({
    timeout: 15000,
  });

  await myDashboardLink.click();

  console.log("\nClicked 'My Dashboard' again.");

  await expect(page).toHaveURL(/dashboard\/jobseeker/i);

  console.log(
    "\nSuccessfully returned to My Dashboard."
  );

  // ============================================================
  // VERIFY SAVED JOB
  // ============================================================

  await homePage.clickSavedJobsTab();

  console.log("\nClicked 'Saved Jobs'.");

  await homePage.verifySavedJob();

  console.log(
    "\nSuccessfully verified the job is saved."
  );
});
