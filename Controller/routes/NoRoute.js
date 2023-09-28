const express = require("express");
const errorController = require("../controllers/errorController");
const router = express.Router();

// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = require("../middleware/populateSelectedUser");
router.use(populateSelectedUser);

router.get("*", errorController.get404Page);

module.exports = router;
