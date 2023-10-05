const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = require("../../middleware/populateSelectedUser");
router.use(populateSelectedUser);

const authMiddleware = require("../../middleware/authMiddleware");

// /admin/add-product
// Because there is an extra layer in index.js of server
router.get("/add-product", authMiddleware.isAdmin, adminController.getAddProduct);
router.post("/add-product", authMiddleware.isAdmin, adminController.postAddProduct);

// /admin/products
// Because there is an extra layer in index.js of server
router.get("/products", authMiddleware.isAdmin, adminController.getProducts);

// /admin/products
// Because there is an extra layer in index.js of server

// These 2 are responsible to handle the logic of "Edit" button.
// Along with these two lines, "adminController.js"
// "addEditProduct.ejs" and "adminProducts.ejs" are responsible of
// handling all the logic and view.
router.get("/edit-product/:productId", authMiddleware.isAdmin, adminController.editProduct);
router.post("/edit-product", authMiddleware.isAdmin, adminController.postEditProduct);

router.post("/delete-product", authMiddleware.isAdmin, adminController.postDeleteProduct);

module.exports = router;
