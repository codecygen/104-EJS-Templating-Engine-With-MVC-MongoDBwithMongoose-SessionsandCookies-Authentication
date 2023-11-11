const express = require("express");
const errorController = require("../controllers/errorController");
const router = express.Router();

// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = require("../../Middleware/populateSelectedUser");
router.use(populateSelectedUser);

// 404-Page
router.get("*", errorController.get404Page);

module.exports = router;
