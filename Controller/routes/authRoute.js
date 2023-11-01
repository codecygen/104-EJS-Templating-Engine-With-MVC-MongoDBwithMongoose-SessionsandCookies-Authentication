const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = require("../../Middleware/populateSelectedUser");
router.use(populateSelectedUser);

router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLoginPage);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUpPage);
router.post("/signup", authController.postSignUpPage);

router.get("/password_reset", authController.getResetPassPage);
router.post("/password_reset", authController.postResetPassPage);

module.exports = router;