// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
  if (res.locals.selectedUser.adminId) {
    next(); // User is an admin, proceed to the next middleware or route handler
  } else {
    res.redirect("/"); // Redirect to a different page or show an error message
  }
};

module.exports = checkAdmin;