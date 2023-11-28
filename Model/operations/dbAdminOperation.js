const Tables = require("../dbAssociation");

const getAllUsers = async () => {
  const allUsers = await Tables.UserTable.getUsers();
  return allUsers;
};

const getOneUser = async (userId) => {
  const foundUser = await Tables.UserTable.getSingleUser(userId);
  return foundUser;
};

const getOneUserWithEmail = async (email) => {
  const foundUser = await Tables.UserTable.getSingleUserWithEmail(email);
  return foundUser;
};

const checkLogin = async (username) => {
  const foundUser = await Tables.UserTable.checkUserLogin(username);

  return foundUser;
};

const getAdminProducts = async (adminId) => {
  const adminProducts = await Tables.ProductTable.adminProducts(adminId);
  return adminProducts;
};

const updateUserData = async (updatedUserModel) => {
  const result = await Tables.UserTable.updateUser(updatedUserModel);
  return result;
};

module.exports = {
  getAllUsers,
  getOneUser,
  getOneUserWithEmail,
  checkLogin,
  getAdminProducts,
  updateUserData,
};
