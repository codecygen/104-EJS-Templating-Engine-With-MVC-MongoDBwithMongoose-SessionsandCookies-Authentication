const Tables = require("../dbAssociation");
const dbAdminOperation = require("./dbAdminOperation");
const dbProductOperation = require("./dbProductOperation");

const addUserAndProductToCart = async (currentUser, addedProduct) => {
  await Tables.UserTable.updateCart(currentUser, addedProduct);
};

const getCartProducts = async (currentUser) => {
  const foundUser = await dbAdminOperation.getOneUser(currentUser._id);

  const allCartItems = foundUser.userCart;
  let totalPrice = 0;

  if (!allCartItems) {
    // return [allCartItems, totalPrice, userTable.userCart];
    return [[], 0, []];
  }

  allCartItems.forEach((item) => {
    totalPrice += item.productPrice * item.qty;
  });

  return [allCartItems, totalPrice];
};

const deleteCartProduct = async (currentUser, deletedProductId) => {
  await Tables.UserTable.removeCartItem(currentUser.userId, deletedProductId);
};

module.exports = {
  addUserAndProductToCart,
  getCartProducts,
  deleteCartProduct,
};
