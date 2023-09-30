const Tables = require("../dbAssociation");

const registerUser = async (newUserData) => {
  const newUser = new Tables.UserTable(newUserData);
  await newUser.createUser();
};

module.exports = { registerUser };
