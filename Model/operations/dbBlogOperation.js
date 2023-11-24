const Tables = require("../dbAssociation");

const bulkCreateBlogs = async () => {
  const result = await Tables.BlogTable.autoAddBlogs();

  return result;
};

const getBlogPosts = async () => {
  const blogPosts = await Tables.BlogTable.getAllBlogs();

  return blogPosts;
};

module.exports = {
  bulkCreateBlogs,
  getBlogPosts,
};
