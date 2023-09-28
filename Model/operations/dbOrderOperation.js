const Tables = require("../dbAssociation");
const dbProductOperation = require("./dbProductOperation");

const getOrders = async (currentUser) => {
  const productIdsAndQty = await Tables.OrderTable.getOrderList(
    currentUser.userId
  );

  let detailedOrderList = [];

  for (order of productIdsAndQty) {
    const modifiedOrder = await Promise.all(order.map(async (product) => {
      const productDetails = await dbProductOperation.getOneProduct(
        product.productId
      );

      return {
        ...productDetails._doc,
        qty: product.qty,
      };
    }));

    detailedOrderList.push(modifiedOrder);
  }

  return detailedOrderList;
};

const postCartToOrders = async (currentUser) => {
  const foundUser = await Tables.UserTable.getSingleUser(currentUser.userId);
  const foundCartItems = foundUser.userCart;

  // if no cart items do not do anything if person tries posting carts!
  if (!foundCartItems || foundCartItems.length === 0) {
    return;
  }

  const adjustedCartItems = foundCartItems.map((item) => {
    return { productId: item._id, qty: item.qty };
  });
  
  await Tables.OrderTable.saveOrder(adjustedCartItems, foundUser._id);
};

module.exports = {
  getOrders,
  postCartToOrders,
};
