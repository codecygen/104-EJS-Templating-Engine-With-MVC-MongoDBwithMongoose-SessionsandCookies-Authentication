# Practice App

## Starting the app for the first time:

- npm i
- Create a database called "shopping-website" in MySQL
- Create .env file and provide the given content.

Download .env file [here](https://github.com/codecygen/106-ENV-FILE-EJS-Templating-Engine-With-MVC-MongoDBwithMongoose-SessionsandCookies-Authentication/blob/main/env).

```bash
# FOR MONGODB ATLAS
# URL = "mongodb+srv://UserName:UserPass@ClusterName.b99wetu.mongodb.net/DBName?retryWrites=true&w=majority";

# FOR LOCAL MONGODB
URL="mongodb://username:password@0.0.0.0:27017/shoppingDB"

EXPRESS_SESSION_KEY = "your-secret-key";

EMAIL=passwordresetemail@email.com
PASSWORD=password

# Needed to be able to import stripe library
STRIPE_KEY=mykeyasdadsad_823952759

# Needed for stripe webhooks
STRIPE_WEBHOOK_KEY=mywebhook_346367
```

- For both payment and server to run, you have to run the both command. First go to the root folder of the project and run.

```bash
npm start
```

- Secondly, go to "/stripe" folder and run. This will allow payment page to work for your development app. Refer to Stripe API section in this documentation to get the payment page work.
```bash
./stripe listen --forward-to http://localhost:3000/payment-confirmation
```

## MVC Pattern (Model View Controller):

### Model:

- Responsible for representing your data.
- Responsible for managing your data (saving, fetching...).
- Does not matter if you manage data in memory, files, databases.
- Contains data related logic.

### View:

- What the users see.
- Should not contain too much logic (HTML, Handlebars, Pug, EJS...).

### Controller:

- Connects "Model" and "View".
- Responsible of establishing the communication of both in both directions.

## Model View Controller (MVC) in this Project

- The MVC pattern helps you break up the frontend and backend code into separate components.
- Model View Controller principles are applied in this project.
- There will be "views", "controllers" and "models" folders to make the project easier to divide into its related logical categories.
- "views" folder stores the front end data in it.
- "controllers" folder stores the specific route controlling functions. These functions are then exported into routes folder. They are basically the list of functions which controls the specific page's behaviors.
- "models" folder stores the "users.json" file which has all the usernames and user ages. These info is pulled by "/display/users" page.

# Notes:

- In "req.body.myFormInput", "myFormInput" is extracted from forms. You can also extract all form inputs with "req.body" only.
- In "req.params.myLink", "myLink" is extracted from the entered link. for example in "http://localhost:3000/:myLink", "myLink" is a dynamic link. For more info, check "router.get("/products/:productId", shopController.getProduct);" in the project. You can also extract all parameters with "req.params" only.
- "req.query.myQuery" gives the "myQuery" info. For example when we enter "http://localhost:3000/products?myQuery=true", "req.query.myQuery" will return "true". The extracted value will always be a string. For more info, refer to "router.get("/edit-product/:productId", adminController.editProduct);" in the project.

# Database (MongoDB):

- MongoDB is used for this project. "mongodb" and "uuidv4" packages are needed to be installed from "npm" for access to the database.

- environmental variables used for this project. I put these variables inside

```javascript
URL =
  "mongodb+srv://UserName:UserPass@ClusterName.b99wetu.mongodb.net/DBName?retryWrites=true&w=majority";
EXPRESS_SESSION_KEY = "your-secret-key";
```

## **Mongoose-Connect-Database**

Basically, **"./Model/database/dbConnection.js"** is used in **"./index.js"** to connect to database.

## **MongoDB-Create-And-Associate-Models**

**"./Model/database/dbAssociation.js"** is used in **./index.js** so that all model associations and models are properly set. We need to only import dbAssociations.js in index.js.

## **Express-Session-Keep-Cookie-in-req.session** <br>

express-session is a package and it keeps some session files in it so the selected admin will be known by the system.

## **Mongoose-Queries**

All query related info kept inside "/Model/tables/orderTable.js", "/Model/tables/productTable.js" and "/Model/tables/userTable.js".

## Referencing Database, Referencing a A Schema to Another with Mongoose **Mongoose-Referencing-Populate-Method**:

[ForumTable's forumUserId is referencing UserTable's \_id here](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/Model/tables/forumTable.js)

```javascript
const forumSchema = new mongoose.Schema(
  {
    .......................

    forumUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserTable",
      required: true,
    },

    .......................
  },
  { collection: "ForumTable" }
);
```

Then, in the same file, we can extract the info of UserTable based on the forumUserId which is the \_id of UserTable. With the populate and exec method down below, we can extract info of all posts along with the post owner's user details which is written inside UserTable.

```javascript
forumSchema.statics.getPosts = async function () {
  // Mongoose-Referencing-Populate-Method
  // mongoose-order-query-in-descending-order
  try {
    const allPosts = await this.find()
      .populate("forumUserId") // populate forumUserId which is referenced to UserTable's _id value
      .sort({ forumDate: -1 }) // Sort by forumDate in descending order
      .exec();
    return allPosts;
  } catch (err) {
    console.error(err);
  }
};
```

## Order Database Results Based on Date or Any Numerical Value:

The keyword is **mongoose-order-query-in-descending-order**

In the code snippet down below, you can see sort method, which tells mongoose the extract database of ForumTable with find method, then order them in the descending order with sort method.

[Ordering query in descending order is here](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/Model/tables/forumTable.js)

```javascript
forumSchema.statics.getPosts = async function () {
  // Mongoose-Referencing-Populate-Method
  // mongoose-order-query-in-descending-order
  try {
    const allPosts = await this.find()
      .populate("forumUserId") // populate forumUserId which is referenced to UserTable's _id value
      .sort({ forumDate: -1 }) // Sort by forumDate in descending order
      .exec();
    return allPosts;
  } catch (err) {
    console.error(err);
  }
};
```

# Sessions and Cookies:

## Cookies:

Some of the cookie attributes are given down below.

```javascript
const dbAdminOperation = require("../../Model/operations/dbAdminOperation");

exports.getLoginPage = async (req, res, next) => {
  // Gets cookie from front end with Get request for the page.
  // req.get("Cookie") will only return not expired cookies
  if (req.get("Cookie")) {
    console.log(req.get("Cookie"));
    console.log(req.cookies);
    // Output:
    // connect.sid=s%3AEc9Ke1LRkapkR1oCWsJhLAQ135sZJvip.FOzakumJ0zFCgJNOUdqtiG0j%2BCyRLGLTF0qrw5Rm88E; loggedIn=true
  }

  res.render("login", {
    pagePath: "/login",
    renderTitle: "Login",
    selectedUser: res.locals.selectedUser,
  });
};

exports.postLoginPage = async (req, res, next) => {
  const {
    "entered-username": enteredUsername,
    "entered-password": enteredPassword,
  } = req.body;

  console.log(enteredUsername, enteredPassword);

  // Sets cookie upon post request to the front end.
  // loggedIn=true
  // It will expire 2023/09/25 00:00AM UTC
  const expiryDate = new Date("2050-09-25T00:00:00Z").toUTCString();
  res.setHeader("Set-Cookie", `loggedIn=true; Expires=${expiryDate}`);

  // Max-Age sets the expiry of the cookie in seconds
  // Even though this cookie will be invalid after 10 seconds
  // It will still stay in browser but will be deleted by browser eventually
  const expirySecond = 10;
  res.setHeader("Set-Cookie", `tenSeconds=true; Max-Age=${expirySecond}`);

  res.redirect("/");
};
```

```text
    Expires:
        This attribute takes a date and time value (in the format specified by RFC 1123) and indicates the exact moment when the cookie will expire. For example: Expires=Wed, 09 Jun 2021 10:18:14 GMT.

    Domain:
        Specifies the domain for which the cookie is valid. The cookie will be sent with requests to subdomains of this domain as well. For example: Domain=example.com.

    Path:
        Specifies the URL path for which the cookie is valid. The cookie will be sent with requests made to this path and its sub-paths. For example: Path=/subpath.

    Secure:
        Indicates that the cookie should only be sent over HTTPS connections. This provides an extra layer of security by ensuring that the cookie is only sent over encrypted connections.

    HttpOnly:
        When set, the cookie cannot be accessed via client-side scripts (e.g., JavaScript). This provides protection against certain types of attacks, like cross-site scripting (XSS).

    SameSite:
        This attribute controls when cookies are sent with requests. It can have three possible values: Strict, Lax, or None. Strict means the cookie will only be sent in a first-party context, Lax means the cookie will be sent with top-level navigations and same-site requests, and None means the cookie will be sent with all requests.

    Priority:
        Indicates the priority of the cookie. This attribute is not widely supported and is typically used in experimental or specific contexts.

    Extension Attributes:
        You can also define custom attributes for cookies. These attributes are ignored by the browser but can be used for application-specific purposes.

Remember, not all browsers support all attributes, and some attributes may have restrictions or behave differently in certain scenarios. Always refer to the relevant specifications and consider the compatibility requirements for your specific use case.
```

## Sessions:

Unlike cookies, sessions are stored in back end.

![how session works PNG](https://github.com/codecygen/103-EJS-Templating-Engine-With-MVC-MongoDBwithMongoose-SessionsandCookies/blob/main/Images/Screenshot%20from%202023-09-24%2015-02-30.png)

To intialize sessions, use these in index.js

```javascript
const session = require("express-session");

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
```

Then in a post based controller function, we need to use

```javascript
req.session.anyName = "yes!";
```

There is also a method that you should keep in mind about sessions. "destroy" method clears out everything in the sessions.

```javascript
req.session.destroy((err) => {
  console.error(err);
  res.redirect("/");
});
```

There is also a method that might be used if you want more control over your res.redirect which is save method for sessions.

```javascript
req.session.save((err) => {
  console.error(err);
  res.redirect("/");
});
```

Next, get based controller function, we can get it back

```javascript
console.log(req.session.anyName);
// Output: yes!
```

After that, for templating engines, res.locals is a feature provided by Express.js. Remember this will not work for libraries like ReactJS.
Firstly, we need to set it in a middleware called populateSelectedUser.js

```javascript
// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = (req, res, next) => {

  const selectedUser = {
    userId: req.session.userId,
    userName: req.session.userName,
    userEmail: req.session.userEmail,
    adminId: req.session.adminId,
  };

  res.locals.selectedUser = selectedUser;
  next();
};

module.exports = ;
```

Then we need to initiate it in the shopRoute.js

```javascript
router.use();
```

Finally inside the shopController.js EJS template can access to res.locals values.

```javascript
exports.getAllUsers = async (req, res, next) => {
  const allUsers = await dbAdminOperation.getAllUsers();

  res.render("auth", {
    pagePath: "/auth",
    renderTitle: "Auth",
    userList: allUsers,
    // router.use(); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to selectedUser that is in res.locals
    // selectedUser: res.locals.selectedUser,
  });
};
```

# Validation and Sanitization

Once you receive the user entered data in post requests, you have both validate and sanitize the data. The validation is making sure the data entered is the data you are expecting. Sanitization is to ensure that the entered data does not have any harmful elements that can potentially compromise your database.

I did not use in this project but, **express-validator** is a popular npm package that is used for data validation and sanitization. Check out **adminController.js** for info. A snippet of the actual file is given down below.

```javascript
........
........

// EXPRESS-VALIDATOR-DATA-VALIDATION-SANITIZATION
const { validationResult } = require('express-validator');
const { check } = require("express-validator");

........
........

exports.postForumPage = async (req, res, next) => {
  // ====================================================
  // EXPRESS-VALIDATOR-DATA-VALIDATION-SANITIZATION
  // ====================================================

  const inputList = [
    check("email").isEmail().normalizeEmail().notEmpty().escape(),
    check("password").isLength({ min: 2 }).escape(),
    check("title").isString().trim().notEmpty().escape(),
    check("message").isString().trim().notEmpty().escape(),
    check("csrfToken").isString().trim().notEmpty().escape(),
  ];

  // Run validation middleware
  await Promise.all(inputList.map((input) => input.run(req)));

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // ====================================================
  // EXPRESS-VALIDATOR-DATA-VALIDATION-SANITIZATION
  // ====================================================

  const { email, password, title, message, csrfToken } = req.body;

  ........
  ........
}

```

# Error Handling:

There are ways to handle errors gracefully. These can be achieved with **if**, **try-catch** and **then().catch()** blocks.

## Problem with Page Display

Lets say, you want to display all registered users in a page but when your app interacts with server, some problem occurs and your app cannot retrieve the registered users. You have to handle this kind of errors gracefully and display an error page. In order to do this refer to keyword **Error-Page-Middleware**.

```javascript
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
};
```

Here, **next(error)** passes error to error handling middleware. In express js, error handling middleware can be used to handle errors. Here is the middleware.

```javascript
// index.js

// Error-Page-Middleware
app.use(errorPageMiddleWare);
```

```javascript
// errorPageMiddleWare.js

// Multer-File-Upload-Download
const multer = require("multer");

// Error-Page-Middleware
const errorPageMiddleware = (err, req, res, next) => {
  // Multer-File-Upload-Download
  // multer if file sie is more than 1MB
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      req.flash("add-product-message", "File size is exceeded!");
      return res.redirect("/admin/add-product");
    }
  } else if (err.httpStatusCode) {
    return res.status(err.httpStatusCode).render("[errorPage]", {
      renderTitle: `HTTP Error: ${err.httpStatusCode}`,
      pagePath: null,
      err: err,
    });
  }
};

module.exports = errorPageMiddleware;
```

## 404 Page

To show 404 page, if the page does not exist refer to keyword **404-Page**

## HTTP Status Codes:

There are more codes than these. These codes are used in the rendering cases so it will be shown in the network section of the browser:

```javascript
res.status(500).render(...)
```

![HTTP Status Codes](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/Images/HTTP%20Status%20Codes.png?raw=true)

# Saving Sessions to MongoDB:

The package needed is **connect-mongodb-session**. Codes are given down below on how to make it work. You can also check this in from the npm package.

```javascript
var express = require("express");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);

require("dotenv").config();

var app = express();
var store = new MongoDBStore(
  {
    uri: process.env.URL,
    databaseName: "connect_mongodb_session_test",
    collection: "sessions",
  },
  function (error) {
    // Should have gotten an error
  }
);

store.on("error", function (error) {
  // Also get an error here
});

app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true,
  })
);
```

After this, whenever you store any info in req.session, it will automatically be saved into database to "sessions" collection.

# Authentication

![Authentication Photo](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-MongoDBwithMongoose-SessionsandCookies-Authentication/blob/main/Images/Screenshot%20from%202023-09-28%2015-18-35.png)

- Check **/Controller/routes/authRoute.js** and **/Controller/controllers/authController.js** for more information on how to authenticate a user.

- **bcrypt** and **expression-session** packages are used for proper authentication processes like signup and login pages.

- **IMPORTANT NOTE**: In this project, I sent form errors with signup and login pages through queries like **await res.redirect(
  `/signup?message=${encodeURIComponent(validityMessage)}`
  );**

  **Express-Flash-Keep-Session-in-req.flash**
  But this can also be done by using an npm package called **connect-flash**. It basically adds a one time use session which will be removed from server's RAM once it is used. **connect-flash** may seem like a more straightforward approach to keep front end notice information to show to the client side user.

```javascript
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

const port = process.env.PORT || 3000;

app.use(
  session({
    secret: "geeksforgeeks",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());

app.get("/", (req, res) => {
  req.flash("message", "Success!!");
  res.redirect("/gfg");
});

app.get("/gfg", (req, res) => {
  const message = req.flash("message");
  res.json({ message: message })
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server is up and listening on", port);
});
```

# Authorization

Authorization is all about which person can view which page and can perform which actions.

For authorization, middleware functions are used.

```javascript
// authMiddleware.js

const isLoggedIn = (req, res, next) => {
  if (res.locals.selectedUser.userId) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (res.locals.selectedUser.adminId) {
    next(); // User is an admin, proceed to the next middleware or route handler
  } else {
    res.redirect("/"); // Redirect to a different page or show an error message
  }
};

module.exports = { isLoggedIn, isAdmin };
```

Then in the routes file

```javascript
const { isLoggedIn } = require("../../middleware/authMiddleware");

router.get("/products", isLoggedIn, shopController.getProducts);
```

# CSRF Attacks

**CSRF-Attacks-Prevention** is the keyword to search for it.

A Cross-Site Request Forgery (CSRF) attack is a type of security exploit where an attacker tricks a user's web browser into making an unintended and unauthorized request to a different website on which the user is authenticated. This can lead to actions being taken on the user's behalf without their consent or knowledge. To prevent CSRF attacks, websites use tokens that validate the origin of the request, ensuring it comes from a trusted source.

1. Create the CSRF token when user successfully signs in and save it to MongoDB. The keyword is **CSRF-Attacks-Prevention**.

```javascript
exports.postLoginPage = async (req, res, next) => {
  const {
    "entered-username": enteredUsername,
    "entered-password": enteredPassword,
  } = req.body;

  const foundUser = await dbAdminOperation.checkLogin(enteredUsername);

  if (!foundUser) {
    return await res.redirect(
      `/login?message=${encodeURIComponent("no-user")}`
    );
  }

  // Comparing hashed password
  bcrypt.compare(enteredPassword, foundUser.password, async (err, result) => {
    if (err) {
      console.error(err);
      return res.redirect("/login");
    }

    // CSRF-Attacks-Prevention
    const createdToken = uuidv4();

    // set session if user successfully logs in
    if (result === true) {
      req.session.userId = foundUser._id;
      req.session.userName = foundUser.userName;
      req.session.userEmail = foundUser.userEmail;
      req.session.adminId = foundUser.adminId;

      // CSRF-Attacks-Prevention
      req.session.csrfToken = createdToken;

      return res.redirect("/");
    }

    await res.redirect(`/login?message=${encodeURIComponent("wrong-pass")}`);
  });
};
```

2. Send CSRF token to the front end with a controller function and also embed the CSRF token to a hidden input in forms. The keyword is **CSRF-Attacks-Prevention**.

```javascript
// Controller function

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
```

Then the cart form should look like this

```HTML
<%- include('includes/head.ejs') %>
    <link rel="stylesheet" href="/shop/productList.css" />
</head>
<body>
    <%- include('includes/nav.ejs') %>
    <main>
        <% if(cartProducts.length > 0) { %>
            <ol>
                <% cartProducts.forEach(cartProduct => { %>
                    <div class="same-line">
                        <li><%= cartProduct.productName %> (<%= cartProduct.productQty %>)</li>
                        <form action="/cart-delete-item" method="POST">
                            <input type="hidden" name="deletedCartItemId" value="<%= cartProduct._id %>" />

                            <!-- CSRF-Attacks-Prevention -->
                            <input type="hidden" name="_csrf" value=<%= csrfToken %>>
                            <button type="submit">Delete Item</button>
                        </form>
                    </div>
                <% }); %>
            </ol>
            <h3>Total Price: <span>$<%= cartPrice %></span></h3>
        <% } else { %>
            <p>There are no products!</p>
        <% } %>

        <form action="/orders" method="POST">
            <!-- CSRF-Attacks-Prevention -->
            <input type="hidden" name="_csrf" value=<%= csrfToken %>>
            <button>Order Now</button>
        </form>
    </main>
</body>
</html>
```

3. Finally ask for the CSRF token in form submission controller functions aka post methods. The keyword is **CSRF-Attacks-Prevention**.

```javascript
exports.postCart = async (req, res, next) => {
  // Arguments are (clientCsrfToken, serverCsrfToken)
  const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

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
```

The content of the **checkCsrfToken** function is;

```javascript
const checkCsrfToken = (clientCsrfToken, serverCsrfToken) => {
  if (clientCsrfToken !== serverCsrfToken) {
    console.error("Invalid CSRF Token!");
    return false;
  }

  return true;
};

module.exports = checkCsrfToken;
```

4. Finally the CSRF attack website content could be like this;

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <p>Say hello to my little friend!</p>

    <!-- Malicious Website (Attacker's Website) -->
    <form action="http://localhost:3000/cart" method="POST" id="maliciousForm">
        <!-- Product id -->
        <input type="hidden" name="addedProductId" value="651f0df22a73acb70d0f836b" />

        <!-- csrf token guessing for csrf website -->
        <input type="hidden" name="_csrf" value="secretCSRF-guessed-value" />
        <button type="submit">Add to Cart - Malicious</button>
    </form>
</body>
</html>
```

If you accidentally click the link on the malicious website, since that form's csrf value is not going to match the csrf value that is coming from the server, server will not handle the request and add the item to the cart.

5. Keep in mind that CSRF token is only important for post methods that are going to change something critical with the user like sending money, changing address etc. Login and Signup pages won't need a CSRF token.

# File Upload and Download

**Multer-File-Upload-Download** is the keyword for this section.

1. **INSTALLING multer PACKAGE**: Install the npm package **multer**.

2. **multer CONFIGURATION FOR IMAGE AND PDF FILES - 1**: Add **enctype="multipart/form-data"** to the form where you also want to submit a file.

```javascript
<form
  action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>"
  method="POST"
  class="centered"
  enctype="multipart/form-data"
>
  ...
</form>
```

3. **multer CONFIGURATION FOR IMAGE AND PDF FILES - 2**: Configure **multer** package in routing file **adminRoute.js** as a middleware.

```javascript
.....

// Multer-File-Upload-Download
const multer = require("multer");

// Multer-File-Upload-Download
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // images will be uploaded to "uploads" directory
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

.....

router.post(
  "/add-product",
  // Multer-File-Upload-Download
  upload.single("newProductImage"),
  isAdmin,
  adminController.postAddProduct
);
```

4. **req.file.path TO GET IMAGE LOCATION**: Then, in the controller file which is **adminController.postAddProduct** for this case, the submitted file will be available in **req.file**.

```javascript
exports.postAddProduct = async (req, res, next) => {
 ...

  const newProduct = {
    productName: req.body.newProductName,
    productDesc: req.body.newProductDescription,
    productPrice: req.body.newProductPrice,
    // Multer-File-Upload-Download
    productImg: req.file && req.file.path ? req.file.path : null,
    adminId: res.locals.selectedUser.adminId,
  };

  ...
  if
  ...
  else if (req.notAllowedFileExtension) {
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
  }
}
```

the console.log for newProduct.productImg will give something like this

```javascript
{
  fieldname: 'newProductImage',
  originalname: '07_Dragon.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'uploads',
  filename: '1699898124801-448980481-07_Dragon.jpg',
  path: 'uploads/1699898124801-448980481-07_Dragon.jpg',
  size: 857444
}
```

5. **EXCESSIVE IMAGE SIZE - ERROR SHOWING**: We should also have an error page to handle errors related to the case where file size gets exceeded.

```javascript
// Multer-File-Upload-Download
const multer = require("multer");

// Error-Page-Middleware
const errorPageMiddleware = (err, req, res, next) => {
  // Multer-File-Upload-Download
  // multer if file sie is more than 1MB
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      req.flash("add-product-message", "File size is exceeded!");
      return res.redirect("/admin/add-product");
    }
  } else if (err.httpStatusCode) {
    return res.status(err.httpStatusCode).render("[errorPage]", {
      renderTitle: `HTTP Error: ${err.httpStatusCode}`,
      pagePath: null,
      err: err,
    });
  }
};

module.exports = errorPageMiddleware;
```

6. **<img> TAG SETTING src PROPERTY**: Finally, when the image file gets uploaded, it has to be shown properly in img tags. Since the console.log for newProduct.productImg will give something like this

```javascript
{
  fieldname: 'newProductImage',
  originalname: '07_Dragon.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'uploads',
  filename: '1699898124801-448980481-07_Dragon.jpg',
  path: 'uploads/1699898124801-448980481-07_Dragon.jpg',
  size: 857444
}
```

path of the uploaded image will reside in database and in system as shown **path: 'uploads/1699898124801-448980481-07_Dragon.jpg'**. So in index file,

```javascript
// Multer-File-Upload-Download
// This is for serving uploaded images folder to show products.
// imagine this file:
// uploads/1700158739221-40615879-01_World.jpg
// if it was
// app.use(express.static(path.join(__dirname, "uploads")));
// app will think the file will be ready in
// localhost:3000/1700158739221-40615879-01_World.jpg
// But when you say
//  <img
// src="/<%= product.productImg %>"
// alt=<%= product.productName %>
// height="300"
//  >
// src will look into localhost:3000/uploads/1700158739221-40615879-01_World.jpg
// and this path does not exist
// by doing it as the way down on the bottom, we tell express to
// go to localhost/uploads, then treat the uploads directory as the
// base/root directory, then apply uploads directory as the static root directory
// so localhost:3000/uploads/1700158739221-40615879-01_World.jpg will be the actual path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

a static path is needed where application has to find uploads and then treats uploads file as the root directory. Then in ejs file, it should show this location.

```html
<!-- Multer-File-Upload-Download -->
<img src="/<%= product.productImg %>" alt="<%" ="product.productName" % />
height="300" >
```

7. **STATIC PDF FILE DOWNLOAD**: If you want your clients to download a static PDF file whenever they need, refer to the keyword **multer-static-content-pdf-file-download**. Remember, the content of the PDF is static in this case. If you want pdf to be changed dynamically refer to the next step.

```javascript
// route

// multer-static-content-pdf-file-download
router.get(
  "/orders/:orderId",
  isLoggedIn,
  isLoggedInTheInvoiceOwner,
  shopController.getInvoice
);
```

```javascript
// isLoggedInTheInvoiceOwner

// multer-pdf-file-download
const isLoggedInTheInvoiceOwner = (req, res, next) => {
  const requestedFileOwnerId = req.params.orderId.split("-")[1];
  const loggedInUserId = req.session.userId.toString();

  if (!loggedInUserId || !requestedFileOwnerId) {
    const err = new Error(
      "Invalid Request: Missing file owner id or not logged in"
    );

    err.httpStatusCode = 401;
    return next(err);
  }

  if (loggedInUserId === requestedFileOwnerId) {
    return next();
  } else {
    const err = new Error("Invalid Request: Unauthorized file access!");

    err.httpStatusCode = 401;
    return next(err);
  }
};
```

Finally,

```javascript
// shopController.getInvoice

// multer-static-content-pdf-file-download
exports.getInvoice = async (req, res, next) => {
  const invoiceFile = `${req.params.orderId}.pdf`;

  const invoiceFilePath = path.join(
    path.dirname(require.main.filename),
    "data",
    "invoices",
    invoiceFile
  );

  // =================================================================
  // =================================================================

  // METHOD 1
  // multer-static-content-pdf-file-download
  // readFileSync() method
  // This internally use streaming data as well like METHOD 3. Use this
  // or use METHOD 2 instead.

  try {
    const data = fs.readFileSync(invoiceFilePath);

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

    res.send(data);

    // ================
    // INSTEAD
    // DO THIS ONLY
    // ================

    // res.download(invoiceFilePath);
  } catch (err) {
    console.error(err);
    next(err);
  }

  // =================================================================
  // =================================================================

  // // METHOD 2
  // // multer-static-content-pdf-file-download
  // // readFile() method
  // // This internally use streaming data as well like METHOD 3. Use this
  // // or use METHOD 1 instead.

  // fs.readFile(invoiceFilePath, (err, data) => {
  //   if (err) {
  //     next(err);
  //   }

  //   // This will open up the link as a pdf file
  //   // http://localhost:3000/orders/invoice-6555245e4ca34d19e71dc13a-1
  //   res.setHeader("Content-Disposition", "inline");

  //   // // This is supposed to open up a prompt to ask us to download file.
  //   // // Only does that in Chrome and not Firefox in case download options changed.
  //   // // This will try to save the pdf to local drive no matter what the
  //   // // browser option is
  //   // res.setHeader(
  //   //   "Content-Disposition",
  //   //   "attachment; filename=" + invoiceFile
  //   // );

  //   res.send(data);

  //   // ================
  //   // INSTEAD
  //   // DO THIS ONLY
  //   // ================

  //   // res.download(invoiceFilePath);
  // });

  // =================================================================
  // =================================================================

  // // METHOD 3
  // // multer-static-content-pdf-file-download
  // // createReadStream method
  // // There is also createWriteStream method!
  // // This method is useful not to overflow the server if the pdf file is too big
  // // This method will download the file step by step, it will load in chunks

  // try {
  //   const file = fs.createReadStream(invoiceFilePath);

  //   res.setHeader("Content-Type", "application/pdf");

  //   // This is supposed to open up a prompt to ask us to download file.
  //   // Only does that in Chrome and not Firefox in case download options changed.
  //   // This will try to save the pdf to local drive no matter what the
  //   // browser option is
  //   res.setHeader(
  //     "Content-Disposition",
  //     "attachment; filename=" + invoiceFile
  //   );

  //   file.pipe(res);
  // } catch (err) {
  //   console.error(err);
  //   next(err);
  // }
};
```

8. **DYNAMIC PDF FILE DOWNLOAD**: If you want to create a PDF file dynamically, such as an invoice, you need that pdf to be created dynamically as per content of the order. To do it, you need to install an npm package called **pdfkit**. Refer to the keyword **multer-dynamic-content-pdf-file-download**. Remember, the content of the PDF is dynamic in this case. If you want pdf to stay static refer to the previous step. Here, everything will be same as keyword **multer-static-content-pdf-file-download** except for the **getInvoice** function content.

```javascript
// multer-dynamic-content-pdf-file-download
const PDFDocument = require("pdfkit");

........

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
  if(fs.existsSync(invoiceFilePath)) {
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
```

# **Pagination**: 

In this section I will cover pagination and I will use "/blog" page for this purpose. Blog page will have a querying parameter like "/blog?page=2" which will get that page. In total it will have 5 pages for this example.

The keyword is **NodeJS-Mongoose-Pagination**. Other than the snippet down below, there are also files like **shopController.js**, **dbBlogoperation.js**, **blogTable.js**, and **blog.ejs**.

```javascript
// NodeJS-Mongoose-Pagination
blogSchema.statics.getBlogsPaginated = async function (
  currentPage,
  itemsPerPage
) {
  try {
    // NodeJS-Mongoose-Pagination
    // skip basically skips that many items in database.
    // lets say if you are on page 2 and if you want 5 items per page
    // (2-1)*5, it will skip the first 5 items and then start grabbing
    // but grabbing will be limited to 5 so it will grab the items from 6 to 10.
    const result = await this.find()
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    return result;
  } catch (err) {
    console.error(err);
  }
};
```

10. **NodeJS Utility Method That Return Promises**:
    Normally as you can see down below, in traditional methods, we need to put all our code inside the parenthesis. This may create a parentheses hell.

```javascript
const bcrypt = require("bcrypt");
.........

bcrypt.compare(enteredPassword, foundUser.password, async (err, result) => {
  ...code here...
}
```

In order to avoid it, we can use promisify utility method as given down below.

```javascript
const { promisify } = require("util");
const comparePass = promisify(bcrypt.compare);

..........

try {
const result = await comparePass(password, foundUser.password);
} catch (err) {
  ..........
}
```

The promify utility method also converts promise.then().catch() to more readable async/await form.

# **FETCH API FROM FRONT END (EJS) AND JSON RESPONSE FROM BACK END**:

- This approach is commonly used in SPA (Single Page Application) for handling asyncronous requests. It improves the user experience.

- There is a sanitization and validation section in this part. for more info refer to the title "Validation and Sanitization".

- In this section instead of posting the page with traditional POST method in Nodejs, we will rely on fetch API from front end javascript, sanitize and validate data both on front and back end. [Refer to this fron end script for fetch API request to backend](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/View/scripts/forum.js). In this link, there is a function called **postForumPage** which is responsible of any post request that is coming to "/forum". This also handles the json response that is made from backend to front end for communicating.

- There is also sections covering the topic like **promisify** utility function to convert functions that return Promises. Refer to title "NodeJS Utility Method That Return Promises" for more info.

- There is also referencing section in the database that finds further info about forumUserId that references the value from BlogTable to UserTable. **find().populate("forumUserId").exec()**. Refer to the title "Referencing Database" in README.md for details.

- Finally, I covered a section where it is possible to order data in decending or ascending order (-1 or 1). **find().sort({ forumDate: -1 }).exec()**. Refer to the title "Order Database Results Based on Date or Any Numerical Value" in README.md for details.

# **Making Payment with Stripe API**:

![Stripe Image](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/Images/Stripe-Image.png?raw=true)

We will only introduce Stripe API test. This will not be a production ready app.

- First thing is you need to have a Stripe Key. You have to access to the dashboard [here](https://dashboard.stripe.com/test/apikeys). Find the "Secret key" tab and reveal the test key. Remember that this key will go to STRIPE_KEY section in .env file.

- Secondly, you can start working on the construction of the payment page. More instructions on how to do it is [here](https://stripe.com/docs/payments/accept-a-payment).

[shopRoute.js](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/Controller/routes/shopRoute.js)
```javascript
// shopRoute.js
router.post("/orders", isLoggedIn, shopController.postOrdersPage);
```

[shopController.js](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/Controller/controllers/shopController.js)
```javascript
// shopController.js
const stripe = require("stripe")(process.env.STRIPE_KEY);
..........

exports.postOrdersPage = async (req, res, next) => {
  .....

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
    payment_method_types: ["card"],
    line_items: lineItems,
    // This will be picked up from webhook session to identify who paid
    customer_email: req.session.userEmail,
    mode: "payment",
    success_url: "http://localhost:3000/orders?order-paid=true",
    cancel_url: "http://localhost:3000/cart",
  });

  res.redirect(303, stripe_session.url);
}
```

- Test this section by entering the credit card info. For a test credit card details, refer [here](https://stripe.com/docs/payments/accept-a-payment). I use "4242 4242 4242 4242" as a credit card number, any future date for expiry date, "111" for CVC. If postal code is asked, you can enter any postal code info. Finally click on Pay button to test this section of your app.

- When you are done with the payment section, you need to focus on getting the Stripe webhook work. Webhook will be an extension in your server that is dedicated to communication in between your server and Stripe API to let your app know that the payment is received and confirmed by Stripe API so that you can change the cart status in your database from here. Because you will run the API to interact with a localhost server, you need to download Stripe CLI [here](https://stripe.com/docs/stripe-cli#login-account). Go to the Linux tab and follow the instructions to download the CLI file. This file is already downloaded and readily available under "/stripe" folder in this project.


- Once you are inside "/stripe" folder, run the following command to login to Stripe CLI. Details are [here](https://stripe.com/docs/stripe-cli#login-account).

```bash
# Stripe CLI
# Command line
./stripe login
```

- When you login, since your test server is run locally on port 3000, you have to redirect incoming requests to port 3000 with next command. Upcoming command will reveal the webhook key on the command line. Copy this key and paste it as STRIPE_WEBHOOK_KEY in .env file.

```bash
# Stripe CLI
# Command line
./stripe listen --forward-to http://localhost:3000/payment-confirmation

> Ready! You are using Stripe API Version [2023-10-16]. Your webhook signing secret is 
whsec_somesecret_stripe-webhook-key (^C to quit)
```

- Finally you can start working on "/payment-confirmation" route on your server to communicate with Stripe API. Refer [here](https://stripe.com/docs/webhooks) for more info. Also, [this page](https://dashboard.stripe.com/test/webhooks) will show "Local listeners" that you forwarded in the previous section. You can also click on "Add local listerner" button to get more info about how to do the webhook event. Once you click on the button, you can also switch to "Received events" tab to see Strip API server response.

[shopRoute.js](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/Controller/routes/shopRoute.js)
```javascript
// shopRoute.js
router.post(
  "/payment-confirmation",
  express.raw({ type: "application/json" }),
  shopController.postPurchaseConfirmationPage,
);
```

then

[shopController.js](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/Controller/controllers/shopController.js)
```javascript
// shopController.js
exports.postPurchaseConfirmationPage = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "charge.succeeded") {
    const chargeResult = event.data.object;
    const billingEmail = chargeResult.billing_details.email;

    const paidUser = await dbAdminOperation.getOneUserWithEmail(billingEmail);

    const [cartProductList, cartTotalPrice] =
      await dbCartOperation.getCartProducts(paidUser);

    const loggedInPaidUser = {
      userId: paidUser._id,
      userName: paidUser.userName,
      userEmail: paidUser.userEmail,
      adminId: paidUser.adminId,
      csrfToken: paidUser.csrfToken,
    };

    // Posts cart to the /orders page
    await dbOrderOperation.postCartToOrders(loggedInPaidUser);
  } else if (
    event.type === "payment_intent.succeeded" ||
    event.type === "payment_intent.created" ||
    event.type === "checkout.session.completed"
  ) {
    // Do nothing!
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
```

- As a last step, you have to adjust index.js' express.json section from this

```javascript
app.use(express.urlencoded({ limit: "50mb", extended: true }));
express.json({ limit: "50mb" })(req, res, next);
```

to this

[index.js](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/index.js)
```javascript
// index.js

..................

app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  if (req.originalUrl === "/payment-confirmation") {
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

..................
```

- You have to make sure that both your server and Stripe API forwarding is working

```bash 
./stripe listen --forward-to http://localhost:3000/payment-confirmation
```

```bash
npm start
```

  You have to make sure that the 

 a. stripe CLI link forwarding, 

 b. express.json configuration in index.js,

 c. routing link in shopRoute.js to direct Stripe API to the same extension for this to work.
 
 which is "localhost:3000/payment-configuration" for this particular project.

```bash
# Stripe CLI
# Command line
./stripe listen --forward-to http://localhost:3000/payment-confirmation
```

```javascript
// express.json configuration in index.js
app.use((req, res, next) => {
  if (req.originalUrl === "/payment-confirmation") {
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});
```

```javascript
// routing link in shopRoute.js
router.post(
  "/payment-confirmation",
  express.raw({ type: "application/json" }),
  shopController.postPurchaseConfirmationPage,
);
```

- Alternatively, you can also trigger the payment method with

```bash
# Stripe CLI
# Command line
./stripe trigger payment_intent.succeeded
```

- Once you make the payment in your website, you have to make sure that the Stripe API server answers with 200 responses like this. For a test credit card details, refer [here](https://stripe.com/docs/payments/accept-a-payment). I use "4242 4242 4242 4242" as a credit card number, any future date for expiry date, "111" for CVC. If postal code is asked, you can enter any postal code info. Finally click on Pay button to test this section of your app.

```bash
2023-12-13 06:05:13   --> charge.succeeded [evt_3OMqFXHZqtEBHqz61RAAKh3C]
2023-12-13 06:05:13  <--  [200] POST http://localhost:3000/payment-confirmation [evt_3OMqFXHZqtEBHqz61RAAKh3C]
2023-12-13 06:05:13   --> checkout.session.completed [evt_1OMqFZHZqtEBHqz6Z5nZuAY2]
2023-12-13 06:05:13  <--  [200] POST http://localhost:3000/payment-confirmation [evt_1OMqFZHZqtEBHqz6Z5nZuAY2]
2023-12-13 06:05:13   --> payment_intent.succeeded [evt_3OMqFXHZqtEBHqz61rliNIG6]
2023-12-13 06:05:13  <--  [200] POST http://localhost:3000/payment-confirmation [evt_3OMqFXHZqtEBHqz61rliNIG6]
2023-12-13 06:05:13   --> payment_intent.created [evt_3OMqFXHZqtEBHqz611AA59S2]
2023-12-13 06:05:13  <--  [200] POST http://localhost:3000/payment-confirmation [evt_3OMqFXHZqtEBHqz611AA59S2]
```

- You can also see these reponse messages inside Stripe by going [here](https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local). Once you are in that page, go to "Received events" tab and re-trigger the payment event to examine the Stripe API server log.

