const mongoose = require("mongoose");

const Tables = require("../dbAssociation");

const getAllUsers = async () => {
  const allUsers = await Tables.UserTable.getUsers();
  return allUsers;
};

const getOneUser = async (userId) => {
  const foundUser = await Tables.UserTable.getSingleUser(userId);
  return foundUser;
};

const checkLogin = async (username) => {
  const foundUser = await Tables.UserTable.checkUserLogin(
    username
  );

  return foundUser;
};

const getAdminProducts = async (adminId) => {
  const adminProducts = await Tables.ProductTable.adminProducts(adminId);
  return adminProducts;
};

module.exports = {
  getAllUsers,
  getOneUser,
  checkLogin,
  getAdminProducts,
};
