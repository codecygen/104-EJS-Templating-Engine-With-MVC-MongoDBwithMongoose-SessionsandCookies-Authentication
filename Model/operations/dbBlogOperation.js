const Tables = require("../dbAssociation");

const bulkCreateBlogs = async () => {
  await Tables.BlogTable.autoAddBlogs();
};

module.exports = {
    bulkCreateBlogs,
};