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

    forumUser: {
      type: String,
      required: true,
    },

    forumDate: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "ForumTable" }
);

module.exports = mongoose.model("ForumTable", forumSchema);
