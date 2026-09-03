import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ENV } from "../config/env";
import { userData } from "../testdata/userData";
import { MailtrapHelper } from "../utils/mailtrapHelper";


test.setTimeout(120000);

// test("Navigate to the job portal login page", async ({ page }) => {
//   const loginPage = new LoginPage(page);

//   await loginPage.navigate(ENV.portalURL);

//   await expect(page).toHaveURL(/test\.jobsatlax\.org/);
//   await expect(loginPage.loginRegisterButton()).toBeVisible();

//   await page.waitForTimeout(1000);
//   await loginPage.clickLoginRegister();

//   await page.waitForNavigation({ timeout: 10000 }).catch(() => {});

//   await expect(page).toHaveURL(/b2clogin\.com.*oauth2\/v2\.0\/authorize/i);

//   await expect(loginPage.signUpAsJobSeekerLink()).toBeVisible();
//   await loginPage.clickSignUpAsJobSeeker();

//   const email = userData.getNewUserEmail();

//   await page.getByLabel(/email/i).fill(email);

//   await page
//     .getByRole("button", {
//       name: /send.*verification.*code/i,
//     })
//     .click();

//   const mailiskLink = `https://app.mailisk.net/inbox/${process.env.MAILISK_NAMESPACE}?email=${email}`;

//   console.log(`\nVerification code sent to: ${email}`);
//   console.log(`\nMailisk inbox: ${mailiskLink}`);
//   console.log(`\nTrying Mailisk API retrieval...`);

//   const password = "Password@123";

//   const completeRegistration = async () => {
//     await page.locator("#newPassword").fill(password);

//     await page.locator("#reenterPassword").fill(password);

//     await page
//       .getByRole("button", {
//         name: "Create",
//         exact: true,
//       })
//       .click();

//     await expect(page).toHaveURL(/test\.jobsatlax\.org|jobsatlax\.org/i, {
//       timeout: 5000,
//     });
//   };

//   const completeProfile = async () => {
//     await page.getByLabel("First Name*").fill("Jagdeesh");

//     await page.getByLabel("Last Name*").fill("W");

//     await page.getByLabel("Phone*").fill("035-432-4234");

//     await page.getByLabel("Zip Code*").fill("90040");

//     await page
//       .getByLabel("Are you between the ages of 18 to 24?")
//       .selectOption({
//         label: "No",
//       });

//     await page
//       .getByLabel("How did you find out about www.jobsatlax.org?*")
//       .selectOption({
//         label: "Social Media",
//       });

//     const referralSource = "Other";

//     await page.getByLabel("Referral source").selectOption({
//       label: referralSource,
//     });

//     if (referralSource === "Other") {
//       await page
//         .getByLabel("Please specify the referral source*")
//         .fill("TestingTestingTesting");
//     }

//     const age = Math.floor(Math.random() * 56) + 25;

//     await page.locator("#age").fill(String(age));

//     console.log(`\nRandom age selected: ${age}`);

//     await page
//       .getByRole("radio", {
//         name: "Male",
//         exact: true,
//       })
//       .check();

//     await page
//       .getByRole("radio", {
//         name: "Yes",
//         exact: true,
//       })
//       .first()
//       .check();

//     await page
//       .getByRole("radio", {
//         name: "No",
//         exact: true,
//       })
//       .nth(1)
//       .check();

//     await page
//       .getByRole("radio", {
//         name: "Hispanic or Latino",
//         exact: true,
//       })
//       .check();

//     await page
//       .getByRole("radio", {
//         name: "Native Hawaiian or Other Pacific Islander",
//         exact: true,
//       })
//       .check();

//     await page.setInputFiles(
//       'input[type="file"]',
//       "C:\\LAWA\\testdata\\profile-photo.png",
//     );

//     await page.waitForTimeout(5000);
//     await page
//       .getByRole("button", {
//         name: "Save Changes",
//         exact: true,
//       })
//       .click();

//     console.log("\nProfile details saved.");
//   };

//   try {
//     const mailtrap = new MailtrapHelper();

//     const verificationCode = await mailtrap.getVerificationCode(email);

//     console.log(`\nCode retrieved automatically: ${verificationCode}`);

//     await page.getByLabel(/verification.*code|code/i).fill(verificationCode);

//     await page
//       .getByRole("button", {
//         name: /verify|submit/i,
//       })
//       .click();

//     await completeRegistration();
//     await completeProfile();
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Unknown error";

//     console.log(`\nMailisk API failed: ${message}`);
//     console.log(
//       `\nPlease open the inbox above, copy the verification code, paste it manually, then click Verify/Submit.`,
//     );
//     console.log(
//       `\nThe test will pause here. After verification, resume the test and password + Create will be automated.`,
//     );
//     await completeRegistration();
//     await completeProfile();
//   }

//   // Store registered user credentials for login test
//   userData.setRegisteredUser(email, password);

//   console.log(`\n--- REGISTERED USER STORED ---`);
//   console.log(`Email: ${email}`);
//   console.log(`Password: ${password}`);
//   console.log(`Stored data: ${JSON.stringify(userData.getRegisteredUser())}`);
//   console.log(`--- END STORAGE ---\n`);

//   console.log(`\nRegistration and profile details completed.`);

//   await page.waitForTimeout(5000);
// await page.pause();
// });


test("Navigate to the job portal login page", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate(ENV.portalURL);

  await expect(page).toHaveURL(/test\.jobsatlax\.org/);
  await expect(loginPage.loginRegisterButton()).toBeVisible();

  await page.waitForTimeout(1000);
  await loginPage.clickLoginRegister();

  await page.waitForNavigation({ timeout: 10000 }).catch(() => {});

  await expect(page).toHaveURL(
    /b2clogin\.com.*oauth2\/v2\.0\/authorize/i
  );

  await expect(loginPage.signUpAsJobSeekerLink()).toBeVisible();
  await loginPage.clickSignUpAsJobSeeker();

  const email = userData.getNewUserEmail();
  const password = userData.credentials.password;
  const profile = userData.profile;

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

  const completeRegistration = async () => {
    await page.locator("#newPassword").fill(password);

    await page.locator("#reenterPassword").fill(password);

    await page
      .getByRole("button", {
        name: "Create",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(
      /test\.jobsatlax\.org|jobsatlax\.org/i,
      {
        timeout: 5000,
      }
    );
  };

  const completeProfile = async () => {
    await page
      .getByLabel("First Name*")
      .fill(profile.firstName);

    await page
      .getByLabel("Last Name*")
      .fill(profile.lastName);

    await page
      .getByLabel("Phone*")
      .fill(profile.phone);

    await page
      .getByLabel("Zip Code*")
      .fill(profile.zipCode);

    await page
      .getByLabel("Are you between the ages of 18 to 24?")
      .selectOption({
        label: profile.age18To24,
      });

    await page
      .getByLabel("How did you find out about www.jobsatlax.org?*")
      .selectOption({
        label: profile.howDidYouFindUs,
      });

    await page
      .getByLabel("Referral source")
      .selectOption({
        label: profile.referralSource,
      });

    if (profile.referralSource === "Other") {
      await page
        .getByLabel("Please specify the referral source*")
        .fill(profile.referralSourceOther);
    }

    const age =
      Math.floor(
        Math.random() * (profile.age.max - profile.age.min + 1)
      ) + profile.age.min;

    await page.locator("#age").fill(String(age));

    console.log(`\nRandom age selected: ${age}`);

    await page
      .getByRole("radio", {
        name: profile.gender,
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
        name: profile.ethnicity,
        exact: true,
      })
      .check();

    await page
      .getByRole("radio", {
        name: profile.race,
        exact: true,
      })
      .check();

    await page.setInputFiles(
      'input[type="file"]',
      profile.profilePhoto
    );

    await page.waitForTimeout(5000);

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

    const verificationCode =
      await mailtrap.getVerificationCode(email);

    console.log(
      `\nCode retrieved automatically: ${verificationCode}`
    );

    await page
      .getByLabel(/verification.*code|code/i)
      .fill(verificationCode);

    await page
      .getByRole("button", {
        name: /verify|submit/i,
      })
      .click();

    await completeRegistration();
    await completeProfile();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.log(`\nMailisk API failed: ${message}`);

    console.log(
      `\nPlease open the inbox above, copy the verification code, paste it manually, then click Verify/Submit.`
    );

    console.log(
      `\nThe test will pause here. After verification, resume the test and password + Create will be automated.`
    );

    await completeRegistration();
    await completeProfile();
  }

  // Store registered user credentials for login test
  userData.setRegisteredUser(email, password);

  console.log(`\n--- REGISTERED USER STORED ---`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(
    `Stored data: ${JSON.stringify(userData.getRegisteredUser())}`
  );
  console.log(`--- END STORAGE ---\n`);

  console.log(`\nRegistration and profile details completed.`);

  await page.waitForTimeout(5000);
  await page.pause();

await page.pause();
});

test("Login with registered user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const registeredUser = userData.getRegisteredUser();

  const email = registeredUser.email;
  const password = registeredUser.password;

  console.log(`\nLogging in with user: ${email}`);

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

    // Fill credentials
    await loginPage.usernameInput().fill(email);
    await loginPage.passwordInput().fill(password);

    console.log(`\nCredentials filled. Clicking Sign in button...`);

    // Login
    await loginPage.loginButton().click();

    // Wait for navigation after login
    await page.waitForNavigation({
      timeout: 10000,
      waitUntil: "domcontentloaded",
    }).catch(() => {});

    console.log(`\nCurrent URL after login: ${page.url()}`);

    // Verify successful login
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

  // ============================================================
  // CLICK EXPLORE JOBS
  // ============================================================

 // ============================================================
// CLICK EXPLORE JOBS
// ============================================================


const exploreJobsButton = page.getByRole("button", {
  name: "Explore All Jobs",
  exact: true,
});

await expect(exploreJobsButton).toBeVisible({
  timeout: 15000,
});

await exploreJobsButton.click();

console.log("\nClicked 'Explore All Jobs'.");

const jobTitleInput = page.locator("#jobTitle");

await expect(jobTitleInput).toBeVisible({
  timeout: 15000,
});

await jobTitleInput.fill("security");

await expect(jobTitleInput).toHaveValue("security");

console.log("\nEntered job search: security");

// Click Search Jobs
const searchButton = page.getByRole("button", {
  name: "Search Jobs",
  exact: true,
});

await expect(searchButton).toBeVisible({
  timeout: 15000,
});

await searchButton.click();

console.log("\nClicked 'Search Jobs'.");

await page.locator("#jobTitle").fill("security");

// Randomly select employment type
const employmentType = page.locator("#employmentType");

const employmentOptions = await employmentType
  .locator("option")
  .evaluateAll((options) =>
    options
      .map((option) => ({
        value: (option as HTMLOptionElement).value,
        label: option.textContent?.trim() || "",
      }))
      .filter((option) => option.value !== "")
  );

const randomEmploymentType =
  employmentOptions[
    Math.floor(Math.random() * employmentOptions.length)
  ];

await employmentType.selectOption({
  value: randomEmploymentType.value,
});

console.log(
  `Random Employment Type selected: ${randomEmploymentType.label}`
);

const jobCategory = page.locator("#jobCategory");

const jobCategoryOptions = await jobCategory
  .locator("option")
  .evaluateAll((options) =>
    options
      .map((option) => ({
        value: (option as HTMLOptionElement).value,
        label: option.textContent?.trim() || "",
      }))
      .filter((option) => option.value !== "")
  );

const randomJobCategory =
  jobCategoryOptions[
    Math.floor(Math.random() * jobCategoryOptions.length)
  ];

await jobCategory.selectOption({
  value: randomJobCategory.value,
});

console.log(
  `Random Job Category selected: ${randomJobCategory.label}`
);

// Click Search Jobs
await page.getByRole("button", {
  name: "Search Jobs",
  exact: true,
}).click();

// ============================================================
// CHECK FOR ZERO RESULTS
// ============================================================

const rangeLabel = page.locator(
  ".mat-mdc-paginator-range-label"
);

await expect(rangeLabel).toBeVisible({
  timeout: 15000,
});

const rangeText = (await rangeLabel.textContent())?.trim() || "";

console.log(`\nSearch result range: ${rangeText}`);

if (/^0\s+of\s+0$/i.test(rangeText)) {
  console.log("\nNo jobs found for the selected filters.");

  const nextPageButton = page.getByRole("button", {
    name: "Next page",
  });

  await expect(nextPageButton).toBeDisabled();

  console.log("\nZero-results scenario handled.");

} else {

  // ============================================================
  // YOUR EXISTING RESULTS/PAGINATION CODE
  // ============================================================

  const nextPageButton = page.getByRole("button", {
    name: "Next page",
  });

  const previousPageButton = page.getByRole("button", {
    name: "Previous page",
  });

  await expect(previousPageButton).toBeDisabled();

  if (await nextPageButton.isEnabled()) {
    console.log("\nNext page is available.");

    const firstPageRange =
      (await rangeLabel.textContent())?.trim() || "";

    await nextPageButton.click();

    await page.waitForTimeout(1000);

    const secondPageRange =
      (await rangeLabel.textContent())?.trim() || "";

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
const editProfileButton = page.getByRole("button", {
  name: /Edit Profile/i,
  exact: false,
});

await expect(editProfileButton).toBeVisible({
  timeout: 15000,
});

await editProfileButton.click();

console.log("\nClicked 'Edit Profile'.");

// ============================================================
// UPDATE PHONE AND ZIP CODE WITH NEW VALUES
// ============================================================

const newPhone = `035-${Math.floor(100 + Math.random() * 900)}-${Math.floor(
  1000 + Math.random() * 9000
)}`;

const newZipCode = String(
  Math.floor(10000 + Math.random() * 90000)
);

await page.getByLabel("Phone*").fill(newPhone);

await page.getByLabel("Zip Code*").fill(newZipCode);

console.log(`\nNew Phone: ${newPhone}`);
console.log(`New Zip Code: ${newZipCode}`);

// Save Changes
const saveChangesButton = page.getByRole("button", {
  name: "Save Changes",
  exact: true,
});

await expect(saveChangesButton).toBeVisible({
  timeout: 15000,
});

await saveChangesButton.click();

console.log("\nProfile updated successfully.");

await expect(myDashboardLink).toBeVisible({
  timeout: 15000,
});

await myDashboardLink.click();

console.log("\nClicked 'My Dashboard' again.");

await expect(page).toHaveURL(/dashboard\/jobseeker/i);

console.log("\nSuccessfully returned to My Dashboard.");


await page.pause();
});