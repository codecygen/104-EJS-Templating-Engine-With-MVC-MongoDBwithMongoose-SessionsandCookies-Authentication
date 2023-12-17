// Mongoose-Queries
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    adminId: mongoose.Types.ObjectId,

    userCart: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          // ref creates a relationship with ProductTable
          ref: "ProductTable",
          required: true,
        },

        productName: {
          type: String,
          required: true,
        },

        productDesc: {
          type: String,
          required: true,
        },

        productPrice: {
          type: Number,
          required: true,
        },

        adminId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
        },
      },
    ],

    passResetData: {
      resetToken: String,

      tokenExpiry: Date,
    },
  },
  // This section enforces collection name to be "UserTable"
  // instead of the default "usertables"
  // also timestamps: true adds createAt, updatedAt fields
  { collection: "UserTable", timestamps: true }
);

// methods keyword creates a function that can be used with
// creating class instance
userSchema.methods.saveUser = async function () {
  let result;

  // Create a new user
  // Email has to be unique due to how model is set up.
  // Thats why if user enters an email that is already registered
  // system will throw MongoServerError.
  try {
    result = await this.save();
    return "successful";
  } catch (err) {
    if (err.code === 11000 && err.keyValue && err.keyValue.userEmail) {
      return "duplicate-email";
    }

    console.error(err);

    return "failed";
  }
};

userSchema.statics.getUsers = async function () {
  try {
    // this refers to UserTable
    const allUsers = await this.find();
    return allUsers;
  } catch (err) {
    console.error(err);
  }
};

userSchema.statics.getSingleUser = async function (userId) {
  try {
    // this refers to UserTable
    const foundUser = await this.findById(userId);
    return foundUser;
  } catch (err) {
    console.error(err);
  }
};

userSchema.statics.updateUser = async function (updatedUserData) {
  try {
    const result = await updatedUserData.save();
    return result;
  } catch (err) {
    console.error(err);
  }
};

userSchema.statics.getSingleUserWithEmail = async function (email) {
  try {
    const foundUser = await this.findOne({ userEmail: email });
    return foundUser;
  } catch (err) {
    console.error(err);
  }
};

userSchema.statics.checkUserLogin = async function (userName) {
  try {
    const foundUser = await this.findOne({
      userName: userName,
    });
    return foundUser;
  } catch (err) {
    console.error(err);
  }
};

userSchema.statics.updateCart = async function (currentUser, addedProduct) {
  let isInCart =
    currentUser.userCart.findIndex((entry) =>
      addedProduct._id.equals(entry._id)
    ) === -1
      ? false
      : true;

  // If not cart, add new line
  if (!isInCart) {
    currentUser.userCart.push({
      ...addedProduct._doc,
      qty: 1,
    });

    try {
      const updateCart = await currentUser.save();
    } catch (err) {
      console.error(err);
    }

    return;
  }

  // {
  //   _id: new ObjectId("64e52e5ba9f5d11228df6a1a"),
  //   userName: 'Aras',
  //   userEmail: 'aras@gmail.com',
  //   adminId: 'ea764199-dcb7-43bb-8e64-7afb783df70c',
  //   userCart: [
  //     { _id: new ObjectId("64f8e789338dc73937e88751"), qty: 6 },
  //     { _id: new ObjectId("64f8eef47af9ade5a236939f"), qty: 6 }
  //   ]
  // }

  // If in cart, increase the quantity
  try {
    const addToCart = await this.updateOne(
      // here we don't need userCart.$._id at this stage
      { _id: currentUser._id, "userCart._id": addedProduct._id },
      // with inc option userCart[1, 2, 3 whatever].qty will be increased by 1
      { $inc: { "userCart.$.qty": 1 } },
      // with this option, updated document will be returned
      { new: true }
    );
  } catch (err) {
    console.error(err);
  }
};

userSchema.statics.removeCartItem = async function (userId, productId) {
  try {
    await this.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { userCart: { _id: new ObjectId(productId) } } }
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

userSchema.statics.removeAllCart = async function (userId) {
  try {
    await this.updateOne({ _id: userId }, { $set: { userCart: [] } });
  } catch (err) {
    console.error(err);
  }
};

userSchema.statics.getUserWithAllCartDetails = async function (userId) {
  try {
    const foundUser = await this.findById(userId)
      .populate("userCart._id")
      .exec();
    return foundUser;
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model("UserTable", userSchema);
