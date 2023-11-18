const fs = require("fs");
const path = require("path");

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

exports.getInvoice = async (req, res, next) => {
  console.log(req.session);

  const invoiceFile = `${req.params.orderId}.pdf`;

  const invoiceFilePath = path.join(
    path.dirname(require.main.filename),
    "data",
    "invoices",
    invoiceFile
  );

  try {
    const data = fs.readFileSync(invoiceFilePath);
    res.send(data);
  } catch (err) {
    console.error(err);
  }
};
