const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    forumTitle: {
      type: String,
      required: true,
    },

    forumMessage: {
      type: String,
      required: true,
    },

    forumUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserTable",
      required: true,
    },

    forumDate: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "ForumTable" }
);

forumSchema.methods.createNewPost = async function () {
  try {
    const result = await this.save();
    return result;
  } catch (err) {
    console.error(err);
  }
};

forumSchema.statics.getPosts = async function () {
  try {
    const allPosts = await this.find()
      .populate("forumUserId") // populate forumUserId which is referenced to UserTable's _id value
      .sort({ forumDate: -1 }) // Sort by forumDate in descending order
      .exec();
    return allPosts;
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model("ForumTable", forumSchema);
