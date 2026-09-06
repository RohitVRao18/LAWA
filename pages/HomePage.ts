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

  async clickExploreAllJobs() {
  const exploreJobsButton = this.page.getByRole("button", {
    name: "Explore All Jobs",
    exact: true,
  });

  await expect(exploreJobsButton).toBeVisible({
    timeout: 15000,
  });

  await exploreJobsButton.click();
}

async clickFirstJob() {
  const jobTitle = this.page.getByRole("button", {
    name: /^View details for/,
  }).first();

  await expect(jobTitle).toBeVisible({
    timeout: 15000,
  });

  await jobTitle.click();
}

async clickSaveJob() {
  const saveJob = this.page.getByRole("button", {
    name: "Save job",
  });

  await expect(saveJob).toBeVisible({
    timeout: 15000,
  });

  await saveJob.click();
}

async closeJobDetails() {
  const closeButton = this.page.getByRole("button", {
    name: "Close job details",
  });

  await expect(closeButton).toBeVisible({
    timeout: 15000,
  });

  await closeButton.click();
}



async searchJobTitle(jobTitle: string) {
  const jobTitleInput = this.page.locator("#jobTitle");

  await expect(jobTitleInput).toBeVisible({
    timeout: 15000,
  });

  await jobTitleInput.fill(jobTitle);
}

async selectRandomEmploymentType() {
  const employmentType = this.page.locator("#employmentType");

  await expect(
    employmentType.locator("option").nth(1)
  ).toBeAttached({
    timeout: 15000,
  });

  const options = await employmentType
    .locator("option")
    .evaluateAll((options) =>
      options
        .map((option) => ({
          value: (option as HTMLOptionElement).value,
          label: option.textContent?.trim() || "",
        }))
        .filter((option) => option.value !== "")
    );

  const randomOption =
    options[Math.floor(Math.random() * options.length)];

  await employmentType.selectOption({
    value: randomOption.value,
  });

  console.log(
    `Random Employment Type selected: ${randomOption.label}`
  );
}

async selectRandomJobCategory() {
  const jobCategory = this.page.locator("#jobCategory");

  const options = await jobCategory
    .locator("option")
    .evaluateAll((options) =>
      options
        .map((option) => ({
          value: (option as HTMLOptionElement).value,
          label: option.textContent?.trim() || "",
        }))
        .filter((option) => option.value !== "")
    );

  const randomOption =
    options[Math.floor(Math.random() * options.length)];

  await jobCategory.selectOption({
    value: randomOption.value,
  });

  console.log(
    `Random Job Category selected: ${randomOption.label}`
  );
}

async clickSearchJobs() {
  const searchButton = this.page.getByRole("button", {
    name: "Search Jobs",
    exact: true,
  });

  await expect(searchButton).toBeVisible({
    timeout: 15000,
  });
  

  await searchButton.click();
  
}

async getSearchResultRange() {
  const rangeLabel = this.page.locator(
    ".mat-mdc-paginator-range-label"
  );

  await expect(rangeLabel).toBeVisible({
    timeout: 15000,
  });

  return (await rangeLabel.textContent())?.trim() || "";
}

async isNextPageEnabled() {
  return await this.page
    .getByRole("button", { name: "Next page" })
    .isEnabled();
}

async clickNextPage() {
  await this.page
    .getByRole("button", { name: "Next page" })
    .click();
}

async verifyPreviousPageDisabled() {
  await expect(
    this.page.getByRole("button", {
      name: "Previous page",
    })
  ).toBeDisabled();
}

async verifyNextPageDisabled() {
  await expect(
    this.page.getByRole("button", {
      name: "Next page",
    })
  ).toBeDisabled();
}

async goToMyDashboard() {
  const myDashboardLink = this.page.getByRole("link", {
    name: "My Dashboard",
    exact: true,
  });

  await expect(myDashboardLink).toBeVisible({
    timeout: 15000,
  });

  await myDashboardLink.click();

  await expect(this.page).toHaveURL(
    /dashboard\/jobseeker/i
  );
}

async clickSavedJobsTab() {
  const savedJobsTab = this.page.getByText("Saved Jobs", {
    exact: false,
  });

  await expect(savedJobsTab).toBeVisible({
    timeout: 15000,
  });

  await savedJobsTab.click();
}

async verifySavedJob() {
  const savedJobIcon = this.page.locator(
    'img.savedClass[src*="icon-tag-saved.svg"]'
  );

  await expect(savedJobIcon).toBeVisible({
    timeout: 15000,
  });

  await savedJobIcon.click();
}

async uploadResume(filePath: string) {
  const resumeUpload = this.page.locator("#resumeUpload");

  await expect(resumeUpload).toBeAttached();

  await resumeUpload.setInputFiles(filePath);
}

async clickApplyNow() {
  const applyNowButton = this.page.getByRole("button", {
    name: "Apply Now",
    exact: true,
  }).first();

  await expect(applyNowButton).toBeVisible({
    timeout: 15000,
  });

  await applyNowButton.click();
}

async clickApplicantName() {
  const applicantName = this.page.locator(
    ".resume-list-left .resume-details h6"
  ).first();

  await expect(applicantName).toBeVisible({
    timeout: 15000,
  });

  await applicantName.click();
}

async clickApply() {
  const applyButton = this.page.getByRole("button", {
    name: "Apply",
    exact: true,
  });

  await expect(applyButton).toBeVisible({
    timeout: 15000,
  });

  await applyButton.click();
}

async closeResumeDialog() {
  const closeButton = this.page.locator(
    'mat-icon[mat-dialog-close].close-icon'
  );

  await expect(closeButton).toBeVisible({
    timeout: 15000,
  });

  await closeButton.click();
}

async publishResume() {
  const publishButton = this.page.getByRole("button", {
    name: "Publish",
    exact: true,
  });

  await expect(publishButton).toBeVisible({
    timeout: 15000,
  });

  await publishButton.click();
}
}