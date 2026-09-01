export const userData = {
  registeredUser: {
    email: "",
    password: "",
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

    console.log(`\nRegistered user stored: ${email}`);
  },

  getRegisteredUser: () => {
    return userData.registeredUser;
  },
};
