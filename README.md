# Practice App

## Starting the app for the first time:

- npm i
- Create a database called "shopping-website" in MySQL
- Create .env file and provide the given content.

```javascript
# FOR MONGODB ATLAS
URL =
  "mongodb+srv://UserName:UserPass@ClusterName.b99wetu.mongodb.net/DBName?retryWrites=true&w=majority";

# FOR LOCAL MONGODB
# URL="mongodb://username:password@0.0.0.0:27017/shoppingDB"

EXPRESS_SESSION_KEY = "your-secret-key";
```

- Start server with "npm start" command which will trigger "nodemon start".

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

- **Mongoose-Connect-Database** <br>
  Basically, **"./Model/database/dbConnection.js"** is used in **"./index.js"** to connect to database.
- **MongoDB-Create-And-Associate-Models** <br>
  **"./Model/database/dbAssociation.js"** is used in **./index.js** so that all model associations and models are properly set. We need to only import dbAssociations.js in index.js.
- **Express-Session-Keep-Cookie-in-req.session** <br>
  express-session is a package and it keeps some session files in it so the selected admin will be known by the system.
- **Mongoose-Queries**
  All query related info kept inside "/Model/tables/orderTable.js", "/Model/tables/productTable.js" and "/Model/tables/userTable.js".
- **Mongoose-Populate**
  This is a method that is supposed to work but I could not get it working in this project. Gives me null because I did not properly define it.

Also the following methods work with find, findOne, findById and findOneAndUpdate methods as stated in the picture down below.

![methods that work](https://github.com/codecygen/101-EJS-Templating-Engine-With-MVC-MongoDBwithMongoose/blob/main/Images/164075580-a4e6fa11-cf0f-4f5f-9265-d065f6456a95.png?raw=true)

```javascript
const user = await User.findById(userId).populate("productId");

// Basically it says only show userName, userAge as a result
// but populate the productId section by pulling the _id of the Product model
// also only populate it with productName and no other details of that product.
const user = await User.findById(userId)
  .select("userName", "productId", "productName")
  .populate("productId", "productName");
```

**Solution:** it means here that productId is directing us to "\_id" field of Product Model. Basically it searches through User model and tries to find User.\_id === userId. Also populates the productId by finding Product.\_id === productId then puts all product details under that user as well.

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

## Saving Sessions to MongoDB:

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

## Authentication
![Authentication Photo](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-MongoDBwithMongoose-SessionsandCookies-Authentication/blob/main/Images/Screenshot%20from%202023-09-28%2015-18-35.png)

- Check **/Controller/routes/authRoute.js** and **/Controller/controllers/authController.js** for more information on how to authenticate a user.

- **bcrypt** and **expression-session** packages are used for proper authentication processes like signup and login pages.

## Authorization
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

## CSRF Attacks
**CSRF-Attacks-Prevention** is the keyword to search for it.

A Cross-Site Request Forgery (CSRF) attack is a type of security exploit where an attacker tricks a user's web browser into making an unintended and unauthorized request to a different website on which the user is authenticated. This can lead to actions being taken on the user's behalf without their consent or knowledge. To prevent CSRF attacks, websites use tokens that validate the origin of the request, ensuring it comes from a trusted source.