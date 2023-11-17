const express = require("express");
const shopController = require("../controllers/shopController");
const router = express.Router();

// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = require("../../Middleware/populateSelectedUser");

const { isLoggedIn } = require("../../Middleware/authMiddleware");

// Express-Session-Keep-Cookie-in-req.session
router.use(populateSelectedUser);

router.get("/", shopController.getIndex);

router.get("/products", isLoggedIn, shopController.getProducts);
router.get(
  "/products/details/:productId",
  isLoggedIn,
  shopController.getProduct
);

router.get("/cart", isLoggedIn, shopController.getCart);
router.post("/cart", isLoggedIn, shopController.postCart);

router.post("/cart-delete-item", isLoggedIn, shopController.postDeleteCartItem);

router.get("/orders", isLoggedIn, shopController.getOrders);
router.post("/orders", isLoggedIn, shopController.orderCart);

router.get("/orders/:orderId", shopController.getInvoice);

module.exports = router;
