// Mongoose-Queries
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const UserTable = require("./userTable");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    orders: [
      [
        {
          productId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "ProductTable",
          },

          qty: {
            type: Number,
            required: true,
          },
        },
      ],
    ],
  },
  { collection: "OrderTable" }
);

orderSchema.statics.saveOrder = async function (orderList, userId) {
  try {
    await this.updateOne(
      { userId: userId },
      {
        $push: {
          orders: {
            $each: [orderList],
          },
        },
      },
      { upsert: true } // This creates a new document if one doesn't exist for the specified userId
    );
  } catch (err) {
    console.error(err);
  }

  await UserTable.removeAllCart(userId);
};

orderSchema.statics.getOrderList = async function (userId) {
  let foundOrders;

  try {
    foundOrders = await this.findOne({ userId: new ObjectId(userId) });
  } catch (err) {
    console.error(err);
    throw err;
  }

  if(!foundOrders) {
    foundOrders = {};
    foundOrders.orders = [];
  }

  const productIdsAndQty = foundOrders.orders;

  return productIdsAndQty;
};

module.exports = mongoose.model("OrderTable", orderSchema);
