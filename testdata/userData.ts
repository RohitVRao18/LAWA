export const userData = {
  registeredUser: {
    email: "",
    password: "",
  },

  credentials: {
    password: process.env.TEST_USER_PASSWORD || "Password@123",
  },

  profile: {
    firstName: "Jagdeesh",
    lastName: "W",
    phone: "035-432-4234",
    zipCode: "90040",

    age: {
      min: 25,
      max: 80,
    },

    gender: "Male",

    age18To24: "No",
    howDidYouFindUs: "Social Media",

    referralSource: "Other",
    referralSourceOther: "TestingTestingTesting",

    ethnicity: "Hispanic or Latino",
    race: "Native Hawaiian or Other Pacific Islander",

    profilePhoto: "C:\\LAWA\\testdata\\profile-photo.png",
  },

  getNewUserEmail: () => {
    const namespace = process.env.MAILISK_NAMESPACE || "test";

    return `user_${Date.now()}@${namespace}.mailisk.net`;
  },

  setRegisteredUser: (email: string, password: string) => {
    userData.registeredUser = {
      email,
      password,
    };
  },

  getRegisteredUser: () => userData.registeredUser,
};
