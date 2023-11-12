const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = require("../../Middleware/populateSelectedUser");

const { isAdmin, isAdminProduct } = require("../../Middleware/authMiddleware");

// Express-Session-Keep-Cookie-in-req.session
router.use(populateSelectedUser);

// /admin/add-product
// Because there is an extra layer in index.js of server
router.get("/add-product", isAdmin, adminController.getAddProduct);
router.post("/add-product", isAdmin, adminController.postAddProduct);

// /admin/products
// Because there is an extra layer in index.js of server
router.get("/products", isAdmin, adminController.getProducts);

// /admin/products
// Because there is an extra layer in index.js of server

// These 2 are responsible to handle the logic of "Edit" button.
// Along with these two lines, "adminController.js"
// "addEditProduct.ejs" and "adminProducts.ejs" are responsible of
// handling all the logic and view.
router.get(
  "/edit-product/:productId",
  isAdmin,
  isAdminProduct,
  adminController.editProduct
);
router.post(
  "/edit-product",
  isAdmin,
  isAdminProduct,
  adminController.postEditProduct
);

router.post(
  "/delete-product",
  isAdmin,
  isAdminProduct,
  adminController.postDeleteProduct
);

// Error-Page-Middleware
router.get("/users", isAdmin, adminController.getUsersPage);

module.exports = router;
