import { expect, Page } from "@playwright/test";

export interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  zipCode: string;

  age18To24: string;
  howDidYouFindUs: string;
  referralSource: string;
  referralSourceOther?: string;

  age: {
    min: number;
    max: number;
  };

  gender: string;
  ethnicity: string;
  race: string;

  profilePhoto: string;
}

export class ProfilePage {
  constructor(private readonly page: Page) {}

  private generateRandomAge(
    min: number,
    max: number
  ): number {
    return (
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  async completeProfile(profile: ProfileData) {
    await this.fillBasicInformation(profile);
    await this.fillDemographics(profile);
    await this.uploadProfilePhoto(profile.profilePhoto);
    await this.save();
  }

  private async fillBasicInformation(
    profile: ProfileData
  ) {
    await this.page
      .getByLabel("First Name*")
      .fill(profile.firstName);

    await this.page
      .getByLabel("Last Name*")
      .fill(profile.lastName);

    await this.page
      .getByLabel("Phone*")
      .fill(profile.phone);

    await this.page
      .getByLabel("Zip Code*")
      .fill(profile.zipCode);

    await this.page
      .getByLabel(
        "Are you between the ages of 18 to 24?"
      )
      .selectOption({
        label: profile.age18To24,
      });

    await this.page
      .getByLabel(
        "How did you find out about www.jobsatlax.org?*"
      )
      .selectOption({
        label: profile.howDidYouFindUs,
      });

    await this.page
      .getByLabel("Referral source")
      .selectOption({
        label: profile.referralSource,
      });

    if (profile.referralSource === "Other") {
      await this.page
        .getByLabel(
          "Please specify the referral source*"
        )
        .fill(profile.referralSourceOther ?? "");
    }
  }

  private async fillDemographics(
    profile: ProfileData
  ) {
    const age = this.generateRandomAge(
      profile.age.min,
      profile.age.max
    );

    await this.page
      .locator("#age")
      .fill(String(age));

    console.log(`Random age selected: ${age}`);

    await this.page
      .getByRole("radio", {
        name: profile.gender,
        exact: true,
      })
      .check();

    await this.page
      .getByRole("radio", {
        name: "Yes",
        exact: true,
      })
      .first()
      .check();

    await this.page
      .getByRole("radio", {
        name: "No",
        exact: true,
      })
      .nth(1)
      .check();

    await this.page
      .getByRole("radio", {
        name: profile.ethnicity,
        exact: true,
      })
      .check();

    await this.page
      .getByRole("radio", {
        name: profile.race,
        exact: true,
      })
      .check();
  }

  private async uploadProfilePhoto(
    filePath: string
  ) {
    await this.page.setInputFiles(
      'input[type="file"]',
      filePath
    );

    const saveButton = this.page.getByRole("button", {
      name: "Save Changes",
      exact: true,
    });

    await expect(saveButton).toBeEnabled();
  }

    private async save() {
    const saveButton = this.page.getByRole("button", {
      name: "Save Changes",
      exact: true,
    });

    await saveButton.click();

    console.log("Profile details saved.");
  }

  async editProfile() {
    const editProfileButton = this.page.getByRole("button", {
      name: /Edit Profile/i,
      exact: false,
    });

    await expect(editProfileButton).toBeVisible({
      timeout: 15000,
    });

    await editProfileButton.click();

    await expect(
      this.page.getByLabel("Phone*")
    ).toBeVisible({
      timeout: 15000,
    });
  }

  async updatePhoneAndZip(phone: string, zipCode: string) {
  await this.page.getByLabel("Phone*").fill(phone);
  await this.page.getByLabel("Zip Code*").fill(zipCode);

  console.log(`\nNew Phone: ${phone}`);
  console.log(`\nNew Zip Code: ${zipCode}`);

  const saveChangesButton = this.page.getByRole("button", {
    name: "Save Changes",
    exact: true,
  });

  await expect(saveChangesButton).toBeVisible({
    timeout: 15000,
  });

  await saveChangesButton.click();

  console.log("\nProfile updated successfully.");
}
}