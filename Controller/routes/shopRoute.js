const express = require("express");
const shopController = require("../controllers/shopController");
const router = express.Router();

// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = require("../../Middleware/populateSelectedUser");

const {
  isLoggedIn,
  isLoggedInTheInvoiceOwner,
} = require("../../Middleware/authMiddleware");

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
router.post("/orders", isLoggedIn, shopController.postOrdersPage);

// isLoggedIn middleware is not needed here
// Because this post request is coming from Stripe server itself.
// Not from your user so if you put that middleware, it will fail the entire
// post request.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  shopController.postPurchaseConfirmationPage,
);

// multer-static-content-pdf-file-download
router.get(
  "/orders/:orderId",
  isLoggedIn,
  isLoggedInTheInvoiceOwner,
  shopController.getInvoice
);

router.get("/blog", shopController.getBlogPage);

module.exports = router;
