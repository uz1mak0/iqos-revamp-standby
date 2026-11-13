import Amplify, { Auth, Storage } from "../Utilities/Backend";

class LoginActions {
  constructor() {}

  login = async (values) => {
    return Auth.signIn(values)
      .then((user) => {
        console.log(user);
        if (user.challengeName === "NEW_PASSWORD_REQUIRED")
          return Auth.completeNewPassword(user, values?.password);
        console.log("Already Logged");
        return user;
      })
      .then((response) => response);
  };

  logout = async () => {
    try {
      const user = await Auth.signOut();
    } catch (err) {
      console.error(err);
    }
  };

  forgotPassword = () => {
    console.log("forgotten");
  };

  testonly = () => {
    console.log("testonly");
  };
}

export default new LoginActions();
