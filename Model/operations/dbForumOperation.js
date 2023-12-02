const Tables = require("../dbAssociation");

const saveForumPost = async (newForumPostData) => {
  const newForumPost = new Tables.ForumTable(newForumPostData);

  const saveResult = await newForumPost.createNewPost();

  return saveResult;
};

module.exports = { saveForumPost };
