const Tables = require("../dbAssociation");

const saveForumPost = async (newForumPostData) => {
  const newForumPost = new Tables.ForumTable(newForumPostData);

  const saveResult = await newForumPost.createNewPost();

  return saveResult;
};

const getAllForumPosts = async () => {
  const allPosts = await Tables.ForumTable.getPosts();
  return allPosts;
};

module.exports = { saveForumPost, getAllForumPosts };
