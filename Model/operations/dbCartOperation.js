const Tables = require("../dbAssociation");
const dbAdminOperation = require("./dbAdminOperation");
const dbProductOperation = require("./dbProductOperation");

const addUserAndProductToCart = async (currentUser, addedProduct) => {
  await Tables.UserTable.updateCart(currentUser, addedProduct);
};

const getCartProducts = async (currentUser) => {
  const foundUser = await dbAdminOperation.getOneUser(currentUser._id);

  const allUserCartItems = foundUser.userCart;
  let totalPrice = 0;

  if (!allUserCartItems) {
    // return [allCartItems, totalPrice, userTable.userCart];
    return [[], 0, []];
  }

  for (const [index, cartItem] of allUserCartItems.entries()) {
    // Try to find the specific cart item in products db
    const dbItem = await dbProductOperation.getOneProduct(cartItem._id);

    // Remove the specific user cart item if it is deleted from database
    if (!dbItem) {
      allUserCartItems.splice(index, 1);
      continue;
    }

    if (cartItem.productName !== dbItem.productName) {
      cartItem.productName = dbItem.productName;
    }

    if (cartItem.productDesc !== dbItem.productDesc) {
      cartItem.productDesc = dbItem.productDesc;
    }

    if (cartItem.productPrice !== dbItem.productPrice) {
      cartItem.productPrice = dbItem.productPrice;
    }
  }

  allUserCartItems.forEach((item) => {
    totalPrice += item.productPrice * item.qty;
  });

  foundUser.userCart = allUserCartItems;
  await foundUser.save();

  return [allUserCartItems, totalPrice];
};

const deleteCartProduct = async (currentUser, deletedProductId) => {
  await Tables.UserTable.removeCartItem(currentUser.userId, deletedProductId);
};

module.exports = {
  addUserAndProductToCart,
  getCartProducts,
  deleteCartProduct,
};
