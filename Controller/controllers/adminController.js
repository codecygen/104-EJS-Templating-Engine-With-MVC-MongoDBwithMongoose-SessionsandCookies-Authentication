const fs = require("fs");

const dbProductOperation = require("../../Model/operations/dbProductOperation");
const dbAdminOperation = require("../../Model/operations/dbAdminOperation");

const checkCsrfToken = require("./utils/checkCsrfToken");

const Tables = require("../../Model/dbAssociation");

exports.getAddProduct = (req, res, next) => {
  if (res.locals.selectedUser.userId === null) {
    return res.redirect("/login");
  }

  res.render("admin/addEditProduct", {
    renderTitle: "Add Product",
    pagePath: "/admin/add-product",
    editing: false,
    // router.use(populateSelectedUser); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to selectedUser that is in res.locals
    // selectedUser: res.locals.selectedUser,

    // CSRF-Attacks-Prevention
    csrfToken: req.session.csrfToken,
    pageMessage: req.flash("add-product-message"),
  });
};

exports.postAddProduct = async (req, res, next) => {
  // CSRF-Attacks-Prevention
  // Arguments are (clientCsrfToken, serverCsrfToken)
  const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

  // CSRF-Attacks-Prevention
  // If client and server tokens don't match do nothing.
  if (!csrfResult) {
    res.redirect("/");
    return;
  }

  const newProduct = {
    productName: req.body.newProductName,
    productDesc: req.body.newProductDescription,
    productPrice: req.body.newProductPrice,
    // Multer-File-Upload-Download
    // Only store the path of the folder in your database
    // Storing the actual file in database would be too big.
    productImg: req.file && req.file.path ? req.file.path : null,
    adminId: res.locals.selectedUser.adminId,
  };

  if (!newProduct) {
    req.flash("add-product-message", "Necessary info is not provided!");
    return res.redirect("/admin/add-product");
  } else if (
    !newProduct.productName ||
    typeof newProduct.productName !== "string"
  ) {
    req.flash("add-product-message", "Invalid product name!");
    return res.redirect("/admin/add-product");
  } else if (
    !newProduct.productPrice ||
    isNaN(parseFloat(newProduct.productPrice)) ||
    !isFinite(newProduct.productPrice)
  ) {
    req.flash("add-product-message", "Invalid product price!");
    return res.redirect("/admin/add-product");
  } else if (
    !newProduct.productDesc ||
    typeof newProduct.productDesc !== "string"
  ) {
    req.flash("add-product-message", "Invalid product description!");
    return res.redirect("/admin/add-product");
  } else if (req.notAllowedFileExtension) {
    // Multer-File-Upload-Download
    req.flash(
      "add-product-message",
      `${req.notAllowedFileExtension} is not allowed. Only jpeg, jpg and png are allowed.`
    );
    return res.redirect("/admin/add-product");
  } else if (!newProduct.productImg) {
    // Multer-File-Upload-Download
    req.flash("add-product-message", "Please upload an image file!");
    return res.redirect("/admin/add-product");
  } else if (!newProduct.adminId || typeof newProduct.adminId !== "object") {
    req.flash("add-product-message", "Not authorized to create the product!");
    return res.redirect("/admin/add-product");
  }

  await dbProductOperation.addNewProduct(newProduct);

  req.flash("add-product-message", "New product is created!");
  res.redirect("/admin/add-product");
};

exports.getProducts = async (req, res, next) => {
  if (res.locals.selectedUser.userId === null) {
    return res.redirect("/login");
  }

  let products = false;

  if (req.session.adminId) {
    products = await dbAdminOperation.getAdminProducts(req.session.adminId);
  }

  res.render("admin/adminProducts", {
    pagePath: "/admin/products",
    productList: products,
    renderTitle: "Admin Products",
    // router.use(); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to selectedUser that is in res.locals
    // selectedUser: res.locals.selectedUser,

    // CSRF-Attacks-Prevention
    csrfToken: req.session.csrfToken,
  });
};

// editProduct and postEditProduct are responsible of
// "Edit" button.
exports.editProduct = async (req, res, next) => {
  if (res.locals.selectedUser.userId === null) {
    return res.redirect("/login");
  }

  const productId = req.params.productId;

  const editMode = req.query.edit;
  const isEditMode = editMode === "true";

  const foundProduct = await dbProductOperation.getOneProduct(productId);

  // Normally if product cannot be found, an error message
  // should be shown.
  if (!foundProduct) {
    return res.redirect("/login");
  }

  res.render("admin/addEditProduct", {
    renderTitle: "Add Product",
    pagePath: "/admin/add-product",
    editing: isEditMode,
    // router.use(populateSelectedUser); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to selectedUser that is in res.locals
    // selectedUser: res.locals.selectedUser,

    product: foundProduct,

    // CSRF-Attacks-Prevention
    csrfToken: req.session.csrfToken,
    pageMessage: req.flash("add-product-message"),
  });
};

// editProduct and postEditProduct are responsible of
// "Edit" button.

// After all "POST" request logic
// always use res.redirect to avoid
// unnecessary loading screen on the page.
exports.postEditProduct = async (req, res, next) => {
  // CSRF-Attacks-Prevention
  // Arguments are (clientCsrfToken, serverCsrfToken)
  const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

  // CSRF-Attacks-Prevention
  // If client and server tokens don't match do nothing.
  if (!csrfResult) {
    res.redirect("/");
    return;
  }

  const productId = req.body.productId;

  const dbProductData = await dbProductOperation.getOneProduct(productId);
  oldImgFilePath = dbProductData.productImg;

  const updatedProduct = {
    _id: productId,
    productName: req.body.newProductName,
    productDesc: req.body.newProductDescription,
    productPrice: req.body.newProductPrice,
    productImg: req.file && req.file.path ? req.file.path : null,
    // router.use(); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to adminId that is in res.locals
    adminId: res.locals.selectedUser.adminId,
  };

  if (!updatedProduct) {
    req.flash("add-product-message", "Necessary info is not provided!");
    return res.redirect("/admin/add-product");
  } else if (
    !updatedProduct.productName ||
    typeof updatedProduct.productName !== "string"
  ) {
    req.flash("add-product-message", "Invalid product name!");
    return res.redirect("/admin/add-product");
  } else if (
    !updatedProduct.productPrice ||
    isNaN(parseFloat(updatedProduct.productPrice)) ||
    !isFinite(updatedProduct.productPrice)
  ) {
    req.flash("add-product-message", "Invalid product price!");
    return res.redirect("/admin/add-product");
  } else if (
    !updatedProduct.productDesc ||
    typeof updatedProduct.productDesc !== "string"
  ) {
    req.flash("add-product-message", "Invalid product description!");
    return res.redirect("/admin/add-product");
  } else if (req.notAllowedFileExtension) {
    // Multer-File-Upload-Download
    req.flash(
      "add-product-message",
      `${req.notAllowedFileExtension} is not allowed. Only jpeg, jpg and png are allowed.`
    );
    return res.redirect("/admin/add-product");
  } else if (!updatedProduct.productImg) {
    // Multer-File-Upload-Download
    req.flash("add-product-message", "Please upload an image file!");
    return res.redirect("/admin/add-product");
  } else if (!updatedProduct.adminId || typeof updatedProduct.adminId !== "object") {
    req.flash("add-product-message", "Not authorized to create the product!");
    return res.redirect("/admin/add-product");
  }

  await dbProductOperation.updateOneProduct(updatedProduct);

  // delete old image file
  // File-Deleting-fs.unlink
  fs.unlink(oldImgFilePath, (err) => {
    if (err) {
      console.error(err);
    }
  });

  res.redirect("/");
};

exports.postDeleteProduct = async (req, res, next) => {
  // CSRF-Attacks-Prevention
  // Arguments are (clientCsrfToken, serverCsrfToken)
  const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

  // CSRF-Attacks-Prevention
  // If client and server tokens don't match do nothing.
  if (!csrfResult) {
    res.redirect("/");
    return;
  }

  const deletedId = req.body.productId;

  const dbProductData = await dbProductOperation.getOneProduct(deletedId);
  oldImgFilePath = dbProductData.productImg;

  await dbProductOperation.deleteOneProduct(deletedId);

  // delete old image file
  // File-Deleting-fs.unlink
  fs.unlink(oldImgFilePath, (err) => {
    if (err) {
      console.error(err);
    }
  });

  res.redirect("/admin/products");
};

// Error-Page-Middleware
// This section is just to show error handling
exports.getUsersPage = async (req, res, next) => {
  try {
    // Uncomment this to crash the /admin.users page.
    // const allUsers = await Table.UserTable.find();

    const allUsers = await Tables.UserTable.find();

    res.render("admin/users", {
      renderTitle: "All Users",
      pagePath: "/admin/users",
      allUsers: allUsers,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;

    console.error("Error in /admin/users page:", error);
    // Error-Page-Middleware
    // passes error to middleware
    next(error);
  }

  // then.catch blocks to handle errors

  // Tables.UserTable.find()
  //   .then((allUsers) => {
  //     // Uncomment this to crash the /admin.users page.
  //     // throw new Error("Some error occured!");

  //     res.render("admin/users", {
  //       renderTitle: "All Users",
  //       pagePath: "/admin/users",
  //       allUsers: allUsers,
  //     });
  //   })
  //   .catch((err) => {
  //     const error = new Error(err);
  //     error.httpStatusCode = 500;

  //     console.error("Error in /admin/users page:", error);
  //     next(error);
  //   });
};
