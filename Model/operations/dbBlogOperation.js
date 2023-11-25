const Tables = require("../dbAssociation");

const bulkCreateBlogs = async () => {
  const result = await Tables.BlogTable.autoAddBlogs();

  return result;
};

const getBlogPosts = async () => {
  const blogPosts = await Tables.BlogTable.getAllBlogs();

  return blogPosts;
};

const countBlogPosts = async () => {
  const dataCount = await Tables.BlogTable.countBlogData();

  return dataCount;
};

// NodeJS-Mongoose-Pagination
const getBlogsAsPaginated = async (currentPage, itemsPerPage) => {
  const result = await Tables.BlogTable.getBlogsPaginated(
    currentPage,
    itemsPerPage
  );

  return result;
};

module.exports = {
  bulkCreateBlogs,
  getBlogPosts,
  countBlogPosts,
  getBlogsAsPaginated,
};
