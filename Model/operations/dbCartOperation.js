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

  allUserCartItems.forEach((item) => {
    totalPrice += item.productPrice * item.qty;
  });

  const allValidProducts = await dbProductOperation.getAllProducts();

  console.log(allUserCartItems);
  console.log("HEY!");
  console.log(allValidProducts);

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
