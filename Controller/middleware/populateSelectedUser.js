// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = (req, res, next) => {
  const selectedUser = {
    userId: req.session.userId,
    userName: req.session.userName,
    userEmail: req.session.userEmail,
    adminId: req.session.adminId,
  };

  res.locals.selectedUser = selectedUser;
  next();
};

module.exports = populateSelectedUser;
