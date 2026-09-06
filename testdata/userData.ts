import path from "path";

const zipCodes = [
  "90001",
  "90002",
  "90003",
  "90004",
  "90005",
  "90006",
  "90007",
  "90008",
  "90010",
  "90011",
  "90012",
  "90013",
  "90014",
  "90015",
  "90016",
  "90017",
  "90018",
  "90019",
  "90020",
  "90021",
];

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
zipCode: zipCodes[Math.floor(Math.random() * zipCodes.length)],
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

    profilePhoto: path.resolve(__dirname, "profile-photo.png"),
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
