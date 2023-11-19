const fs = require("fs");
const path = require("path");

// multer-dynamic-content-pdf-file-download
const PDFDocument = require("pdfkit");

const dbProductOperation = require("../../Model/operations/dbProductOperation");
const dbAdminOperation = require("../../Model/operations/dbAdminOperation");
const dbCartOperation = require("../../Model/operations/dbCartOperation");
const dbOrderOperation = require("../../Model/operations/dbOrderOperation");

const checkCsrfToken = require("./utils/checkCsrfToken");

// while rendering, we send "products" data
// as "productList"
// This is just "/products" route. In the index.js
// file, because it is indicated as
// app.use("/display", userViewRoute);
// combination of these 2 routes become
// "/display/products"

exports.getProducts = async (req, res, next) => {
  const allProducts = await dbProductOperation.getAllProducts();

  // This means render productList.ejs
  // with renderTitle, pagePath and productList arguments
  // server will understand "allProducts" as allProducts.ejs because
  // it is indicated in index.js like that, html is the root folder for all
  // ejs files.
  res.render("products/index", {
    pagePath: "/products",
    productList: allProducts,
    renderTitle: "All Products",
    selectedUser: res.locals.selectedUser,

    // CSRF-Attacks-Prevention
    csrfToken: req.session.csrfToken,
  });
};

exports.getIndex = async (req, res, next) => {
  const products = await dbProductOperation.getAllProducts();

  res.render("index", {
    pagePath: "/",
    productList: products,
    renderTitle: "Shop",
    // router.use(populateSelectedUser); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to selectedUser that is in res.locals
    // selectedUser: res.locals.selectedUser,
  });
};

exports.getCart = async (req, res, next) => {
  const currentUser = await dbAdminOperation.getOneUser(req.session.userId);

  const [cartProductList, cartTotalPrice, userCartDB] =
    await dbCartOperation.getCartProducts(currentUser);

  res.render("cart", {
    pagePath: "/cart",
    renderTitle: "Your Cart",
    cartProducts: cartProductList,
    cartPrice: cartTotalPrice,
    // router.use(populateSelectedUser); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to selectedUser that is in res.locals
    // selectedUser: res.locals.selectedUser,

    // CSRF-Attacks-Prevention
    csrfToken: req.session.csrfToken,
  });
};

exports.postCart = async (req, res, next) => {
  // CSRF-Attacks-Prevention
  // Arguments are (clientCsrfToken, serverCsrfToken)
  const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

  // CSRF-Attacks-Prevention
  // If client and server tokens don't match do nothing.
  if (!csrfResult) {
    res.redirect("/cart");
    return;
  }

  const addedProductId = req.body.addedProductId;

  const addedProduct = await dbProductOperation.getOneProduct(addedProductId);

  const currentUser = await dbAdminOperation.getOneUser(req.session.userId);

  await dbCartOperation.addUserAndProductToCart(currentUser, addedProduct);

  res.redirect("/cart");
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;

  const foundProduct = await dbProductOperation.getOneProduct(productId);

  res.render("products/details", {
    pagePath: "/products",
    renderTitle: `${foundProduct.productName} Details`,
    product: foundProduct,
    // router.use(populateSelectedUser); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to selectedUser that is in res.locals
    // selectedUser: res.locals.selectedUser,

    // CSRF-Attacks-Prevention
    csrfToken: req.session.csrfToken,
  });
};

exports.postDeleteCartItem = async (req, res, next) => {
  // CSRF-Attacks-Prevention
  // Arguments are (clientCsrfToken, serverCsrfToken)
  const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

  // CSRF-Attacks-Prevention
  // If client and server tokens don't match do nothing.
  if (!csrfResult) {
    res.redirect("/cart");
    return;
  }

  const loggedInUser = res.locals.selectedUser;
  const deletedCartItemId = req.body.deletedCartItemId;

  await dbCartOperation.deleteCartProduct(loggedInUser, deletedCartItemId);

  res.redirect("/cart");
};

exports.getOrders = async (req, res, next) => {
  const loggedInUser = res.locals.selectedUser;

  const orderList = await dbOrderOperation.getOrders(loggedInUser);

  return res.render("orders/index", {
    pagePath: "/orders",
    renderTitle: "Orders",
    orderList,
    userId: loggedInUser.userId.toString(),
  });
};

exports.orderCart = async (req, res, next) => {
  // CSRF-Attacks-Prevention
  // Arguments are (clientCsrfToken, serverCsrfToken)
  const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

  // CSRF-Attacks-Prevention
  // If client and server tokens don't match do nothing.
  if (!csrfResult) {
    res.redirect("/cart");
    return;
  }

  const loggedInUser = res.locals.selectedUser;
  await dbOrderOperation.postCartToOrders(loggedInUser);

  res.redirect("/orders");
};

// ========================================================
// ================= STATIC PDF CREATION =================
// ========================================================

// // multer-static-content-pdf-file-download
// exports.getInvoice = async (req, res, next) => {
//   const invoiceFile = `static-${req.params.orderId}.pdf`;

//   const invoiceFilePath = path.join(
//     path.dirname(require.main.filename),
//     "data",
//     "invoices",
//     invoiceFile
//   );

//   // =================================================================
//   // =================================================================

//   // METHOD 1
//   // multer-static-content-pdf-file-download
//   // readFileSync() method
//   // This internally use streaming data as well like METHOD 3. Use this
//   // or use METHOD 2 instead.

//   try {
//     const data = fs.readFileSync(invoiceFilePath);

//     // This allows pdf to open on browser
//     res.setHeader("Content-Type", "application/pdf");

//     // This will open up the link as a pdf file
//     // http://localhost:3000/orders/invoice-6555245e4ca34d19e71dc13a-1
//     res.setHeader("Content-Disposition", "inline");

//     // // This is supposed to open up a prompt to ask us to download file.
//     // // Only does that in Chrome and not Firefox in case download options changed.
//     // // This will try to save the pdf to local drive no matter what the
//     // // browser option is
//     // res.setHeader(
//     //   "Content-Disposition",
//     //   "attachment; filename=" + invoiceFile
//     // );

//     res.send(data);

//     // ================
//     // INSTEAD
//     // DO THIS ONLY
//     // ================

//     // res.download(invoiceFilePath);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }

//   // =================================================================
//   // =================================================================

//   // // METHOD 2
//   // // multer-static-content-pdf-file-download
//   // // readFile() method
//   // // This internally use streaming data as well like METHOD 3. Use this
//   // // or use METHOD 1 instead.

//   // fs.readFile(invoiceFilePath, (err, data) => {
//   //   if (err) {
//   //     next(err);
//   //   }

//   //   // This will open up the link as a pdf file
//   //   // http://localhost:3000/orders/invoice-6555245e4ca34d19e71dc13a-1
//   //   res.setHeader("Content-Disposition", "inline");

//   //   // // This is supposed to open up a prompt to ask us to download file.
//   //   // // Only does that in Chrome and not Firefox in case download options changed.
//   //   // // This will try to save the pdf to local drive no matter what the
//   //   // // browser option is
//   //   // res.setHeader(
//   //   //   "Content-Disposition",
//   //   //   "attachment; filename=" + invoiceFile
//   //   // );

//   //   res.send(data);

//   //   // ================
//   //   // INSTEAD
//   //   // DO THIS ONLY
//   //   // ================

//   //   // res.download(invoiceFilePath);
//   // });

//   // =================================================================
//   // =================================================================

//   // // METHOD 3
//   // // multer-static-content-pdf-file-download
//   // // createReadStream method
//   // // There is also createWriteStream method!
//   // // This method is useful not to overflow the server if the pdf file is too big
//   // // This method will download the file step by step, it will load in chunks

//   // try {
//   //   const file = fs.createReadStream(invoiceFilePath);

//   //   res.setHeader("Content-Type", "application/pdf");

//   //   // This is supposed to open up a prompt to ask us to download file.
//   //   // Only does that in Chrome and not Firefox in case download options changed.
//   //   // This will try to save the pdf to local drive no matter what the
//   //   // browser option is
//   //   res.setHeader(
//   //     "Content-Disposition",
//   //     "attachment; filename=" + invoiceFile
//   //   );

//   //   file.pipe(res);
//   // } catch (err) {
//   //   console.error(err);
//   //   next(err);
//   // }
// };

// ========================================================
// ================= DYNAMIC PDF CREATION =================
// ========================================================

// multer-dynamic-content-pdf-file-download
exports.getInvoice = async (req, res, next) => {
  const invoiceFile = `dynamic-${req.params.orderId}.pdf`;

  const invoiceFilePath = path.join(
    path.dirname(require.main.filename),
    "data",
    "invoices",
    invoiceFile
  );

  const pdfDoc = new PDFDocument();

  // This allows pdf to open on browser
  res.setHeader("Content-Type", "application/pdf");

  // This will open up the link as a pdf file
  // http://localhost:3000/orders/invoice-6555245e4ca34d19e71dc13a-1
  res.setHeader("Content-Disposition", "inline");

  // // This is supposed to open up a prompt to ask us to download file.
  // // Only does that in Chrome and not Firefox in case download options changed.
  // // This will try to save the pdf to local drive no matter what the
  // // browser option is
  // res.setHeader(
  //   "Content-Disposition",
  //   "attachment; filename=" + invoiceFile
  // );

  pdfDoc.pipe(fs.createWriteStream(invoiceFilePath));
  pdfDoc.pipe(res);

  pdfDoc.text("Lmao!");

  pdfDoc.end();
};
