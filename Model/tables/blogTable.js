const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: true,
    },

    blogContent: {
      type: String,
      required: true,
    },
  },
  { collection: "BlogTable" }
);

blogSchema.statics.autoAddBlogs = async function () {
  try {
    console.log("It worked!");
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model("BlogTable", blogSchema);
