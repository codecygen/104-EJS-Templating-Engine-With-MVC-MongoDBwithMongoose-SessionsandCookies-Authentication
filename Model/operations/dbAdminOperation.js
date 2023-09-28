const mongoose = require("mongoose");

const Tables = require("../dbAssociation");

const checkAndCreateAdminsAndUsers = async () => {
  const allUsers = await getAllUsers();

  if (allUsers.length > 0) {
    return;
  }

  const newUsers = [
    {
      userName: "Aras",
      userEmail: "aras@gmail.com",
      password: "Aras",
      adminId: new mongoose.Types.ObjectId(),
    },
    {
      userName: "Jason",
      userEmail: "jason@gmail.com",
      password: "Jason",
      adminId: new mongoose.Types.ObjectId(),
    },
    {
      userName: "Alice",
      userEmail: "alice@gmail.com",
      password: "Alice",
    },
    {
      userName: "Amanda",
      userEmail: "amanda@gmail.com",
      password: "Amanda",
    },
  ];

  await Tables.UserTable.createUsers(newUsers);
};

const getAllUsers = async () => {
  const allUsers = await Tables.UserTable.getUsers();
  return allUsers;
};

const getOneUser = async (userId) => {
  const foundUser = await Tables.UserTable.getSingleUser(userId);
  return foundUser;
};

const checkLogin = async (username, password) => {
  const foundUser = await Tables.UserTable.checkUserLogin(
    username,
    password
  );

  return foundUser;
};

const getAdminProducts = async (adminId) => {
  const adminProducts = await Tables.ProductTable.adminProducts(adminId);
  return adminProducts;
};

module.exports = {
  checkAndCreateAdminsAndUsers,
  getAllUsers,
  getOneUser,
  checkLogin,
  getAdminProducts,
};
