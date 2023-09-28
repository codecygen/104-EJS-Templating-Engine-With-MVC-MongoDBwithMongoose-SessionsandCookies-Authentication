const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = require("../middleware/populateSelectedUser");
router.use(populateSelectedUser);

const checkAdmin = require("../middleware/checkAdmin");

// /admin/add-product
// Because there is an extra layer in index.js of server
router.get("/add-product", checkAdmin, adminController.getAddProduct);
router.post("/add-product", checkAdmin, adminController.postAddProduct);

// /admin/products
// Because there is an extra layer in index.js of server
router.get("/products", checkAdmin, adminController.getProducts);

// /admin/products
// Because there is an extra layer in index.js of server

// These 2 are responsible to handle the logic of "Edit" button.
// Along with these two lines, "adminController.js"
// "addEditProduct.ejs" and "adminProducts.ejs" are responsible of
// handling all the logic and view.
router.get("/edit-product/:productId", checkAdmin, adminController.editProduct);
router.post("/edit-product", checkAdmin, adminController.postEditProduct);

router.post("/delete-product", checkAdmin, adminController.postDeleteProduct);

module.exports = router;
