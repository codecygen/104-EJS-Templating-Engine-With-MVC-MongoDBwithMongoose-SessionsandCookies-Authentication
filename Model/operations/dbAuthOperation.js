const Tables = require("../dbAssociation");

const registerUser = async (newUserData) => {
  const newUser = new Tables.UserTable(newUserData);
  const registerResult = await newUser.saveUser();

  return registerResult;
};

const changePassword = async (user, newPass) => {
  user.password = newPass;
  user.passResetData.resetToken = null;
  user.passResetData.tokenExpiry = null;

  const changePassResult = await user.saveUser();

  return changePassResult;
};

module.exports = { registerUser, changePassword };
