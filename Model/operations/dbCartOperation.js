const Tables = require("../dbAssociation");
const dbAdminOperation = require("./dbAdminOperation");
const dbProductOperation = require("./dbProductOperation");

const addUserAndProductToCart = async (currentUser, addedProduct) => {
  await Tables.UserTable.updateCart(currentUser, addedProduct);
};

const getCartProducts = async (currentUser) => {
  const foundUser = await dbAdminOperation.getOneUser(currentUser._id);

  const userCartDB = foundUser.userCart;
  let totalPrice = 0;

  if (!userCartDB) {
    // return [allCartItems, totalPrice, userTable.userCart];
    return [[], 0, []];
  }

  const allCartItems = await Promise.all(
    userCartDB.map(async (cartItem) => {
      const productDetails = await dbProductOperation.getOneProduct(
        cartItem._id
      );
      return { ...productDetails._doc, productQty: cartItem.qty };
    })
  );

  allCartItems.forEach((item) => {
    totalPrice += item.productPrice * item.productQty;
  });

  return [allCartItems, totalPrice, userCartDB];
};

const deleteCartProduct = async (currentUser, deletedProductId) => {
  await Tables.UserTable.removeCartItem(
    currentUser.userId,
    deletedProductId
  );
};

module.exports = {
  addUserAndProductToCart,
  getCartProducts,
  deleteCartProduct,
};
