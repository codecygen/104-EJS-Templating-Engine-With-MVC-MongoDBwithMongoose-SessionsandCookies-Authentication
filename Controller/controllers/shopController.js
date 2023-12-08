const stripe = require("stripe")(process.env.STRIPE_KEY);

const fs = require("fs");
const path = require("path");

// multer-dynamic-content-pdf-file-download
const PDFDocument = require("pdfkit");

const dbProductOperation = require("../../Model/operations/dbProductOperation");
const dbAdminOperation = require("../../Model/operations/dbAdminOperation");
const dbCartOperation = require("../../Model/operations/dbCartOperation");
const dbOrderOperation = require("../../Model/operations/dbOrderOperation");
const dbBlogOperation = require("../../Model/operations/dbBlogOperation");

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

  const [cartProductList, cartTotalPrice] =
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

exports.postOrdersPage = async (req, res, next) => {
  const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

  // If client and server tokens don't match do nothing.
  if (!csrfResult) {
    res.redirect("/checkout");
    return;
  }

  const currentUser = await dbAdminOperation.getUserWithCartDetails(
    req.session.userId
  );

  // If the cart is empty
  if (!currentUser.userCart) {
    res.redirect("/cart");
  }

  let lineItems = [];

  lineItems = currentUser.userCart.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item._id.productName,
          description: item._id.productDesc,
          images: [
            "https://c1.wallpaperflare.com/preview/741/52/995/old-books-book-books-old.jpg",
          ],
          // metadata: {color: "blue", size: "medium"}
        },
        unit_amount: item._id.productPrice * 100, // Because stripe thinks result is divided by 100.
      },
      quantity: item.qty,
    };
  });

  const stripe_session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.redirect(303, stripe_session.url);
};

exports.getSuccessPage = async (req, res, next) => {
  // const stripe_session_id = req.query.session_id;

  const stripe_session = await stripe.checkout.sessions.retrieve("cs_test_b12z7IvUtd3RrjLG5nlJr7wVRgxPUOoeaVGcYWsmuVtZ5FxkKEYVagZSWt");
  // Now you can access information about the completed session, e.g., session.payment_status

  console.log("Payment status:", stripe_session.payment_status);

  res.status(200).end();
};

// exports.orderCart = async (req, res, next) => {
//   // CSRF-Attacks-Prevention
//   // Arguments are (clientCsrfToken, serverCsrfToken)
//   const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

//   // CSRF-Attacks-Prevention
//   // If client and server tokens don't match do nothing.
//   if (!csrfResult) {
//     res.redirect("/cart");
//     return;
//   }

//   const loggedInUser = res.locals.selectedUser;

//   // Updates user cart if there is any update in the actual product
//   const currentUser = await dbAdminOperation.getOneUser(req.session.userId);
//   const [cartProductList, cartTotalPrice] =
//     await dbCartOperation.getCartProducts(currentUser);

//   // Posts cart to the /orders page
//   await dbOrderOperation.postCartToOrders(loggedInUser);

//   res.redirect("/orders");
// };

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

  // Send file if it already exists!
  if (fs.existsSync(invoiceFilePath)) {
    return res.sendFile(invoiceFilePath);
  }

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

  const loggedInUser = res.locals.selectedUser;
  const orderList = await dbOrderOperation.getOrders(loggedInUser);
  const orderIndex = req.params.orderId.split("-")[2] - 1;
  const orderSpecificProducts = orderList[orderIndex];
  let totalPrice = 0;

  pdfDoc.fontSize(26).text("Invoice", { underline: true });
  pdfDoc.fontSize(16).text("______________________");

  orderSpecificProducts.forEach((product) => {
    pdfDoc.text(
      `${product.productName} - ${product.qty} x $${product.productPrice}`
    );
    totalPrice += product.qty * product.productPrice;
  });

  pdfDoc.text("______________________");

  pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);

  pdfDoc.end();
};

exports.getBlogPage = async (req, res, next) => {
  // NodeJS-Mongoose-Pagination
  const currentPage = parseInt(req.query.page);
  const itemsPerPage = 1;

  let blogData;

  blogData = await dbBlogOperation.getBlogPosts();
  const totalPages = await dbBlogOperation.countBlogPosts();

  if (!blogData) {
    next(new Error("Cannot find blog posts"));
  }

  if (!blogData.length) {
    await dbBlogOperation.bulkCreateBlogs();
  }

  // NodeJS-Mongoose-Pagination
  const currentPageBlog = await dbBlogOperation.getBlogsAsPaginated(
    currentPage,
    itemsPerPage
  );

  return res.render("blog", {
    pagePath: "/blog",
    renderTitle: "Blog Posts",
    blogData: currentPageBlog[0],
    currentPage: currentPage,
    totalPages: totalPages,
  });
};
