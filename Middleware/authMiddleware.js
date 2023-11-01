const dbProductOperation = require("../Model/operations/dbProductOperation");

const isLoggedIn = (req, res, next) => {
  if (res.locals.selectedUser.userId) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (res.locals.selectedUser.adminId) {
    next(); // User is an admin, proceed to the next middleware or route handler
  } else {
    res.redirect("/"); // Redirect to a different page or show an error message
  }
};

// This middleware prevents admins to edit each other's created products.
const isAdminProduct = async (req, res, next) => {
  const loggedInAdminId = req.session.adminId;

  const bodyProductId = req.body.productId;
  const paramsProductId = req.params.productId;

  const bodyProducts = await dbProductOperation.getOneProduct(bodyProductId);
  const paramsProducts = await dbProductOperation.getOneProduct(
    paramsProductId
  );

  if (
    loggedInAdminId.equals(bodyProducts?.adminId) ||
    loggedInAdminId.equals(paramsProducts?.adminId)
  ) {
    next();
  } else {
    return res.redirect("/");
  }
};

module.exports = { isLoggedIn, isAdmin, isAdminProduct };
