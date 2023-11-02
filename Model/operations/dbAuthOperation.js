const Tables = require("../dbAssociation");

const registerUser = async (newUserData) => {
  const newUser = new Tables.UserTable(newUserData);
  const registerResult = await newUser.saveUser();
  
  return registerResult;
};

module.exports = { registerUser };
