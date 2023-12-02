const express = require("express");

const path = require("path");

const adminController = require("../controllers/adminController");
const router = express.Router();

// Multer-File-Upload-Download
const multer = require("multer");

// Multer-File-Upload-Download
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

// Multer-File-Upload-Download
const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype;

  const fileExtension = path.extname(file.originalname).split(".").pop();

  if (
    fileType === "image/png" ||
    fileType === "image/jpg" ||
    fileType === "image/jpeg"
  ) {
    // To accept file, pass true, or false if you don't want!
    cb(null, true);
  } else {
    req.notAllowedFileExtension = fileExtension;
    return cb(null, false, req.notAllowedFileExtension);
  }
};

// Multer-File-Upload-Download
// file upload location is "/uploads"
const upload = multer({
  storage: fileStorage,
  // 1MB file size limit
  limits: { fileSize: 1000000 },
  fileFilter: fileFilter,
});

// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = require("../../Middleware/populateSelectedUser");

const { isAdmin, isAdminProduct } = require("../../Middleware/authMiddleware");

// Express-Session-Keep-Cookie-in-req.session
router.use(populateSelectedUser);

// /admin/add-product
// Because there is an extra layer in index.js of server
router.get("/add-product", isAdmin, adminController.getAddProduct);

router.post(
  "/add-product",
  // Multer-File-Upload-Download
  upload.single("newProductImage"),
  isAdmin,
  adminController.postAddProduct
);

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
  upload.single("newProductImage"),
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

router.get("/forum", isAdmin, adminController.getForumPage);
router.post("/forum", isAdmin, adminController.postForumPage)

module.exports = router;
