const express = require("express");
const path = require("path");

// Mongoose-Connect-Database
const mongoose = require("mongoose");

// Express-Session-Keep-Cookie-in-req.session
// This is used to keep session for chosen admin
const session = require("express-session");

// This is used for instant messaging
// keeps messages in sessions as req.flash
// Express-Flash-Keep-Session-in-req.flash
const flash = require("connect-flash");

// Store sessions in MongoDB
const MongoDBStore = require("connect-mongodb-session")(session);

// Mongoose-Connect-Database
// Allows .env file to be used
require("dotenv").config();

const app = express();

// Store sessions in MongoDB
const store = new MongoDBStore({
  uri: process.env.URL,
  collection: "sessions",
});

// Express body parsing
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(express.json({ limit: "50mb" }));

app.use((req, res, next) => {
  if (req.originalUrl === "/payment-confirmation") {
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

// Specify CSS file location
app.use(express.static(path.join(__dirname, "View/styles")));

// Specify Front End Javascript file location
app.use(express.static(path.join(__dirname, "View/scripts")));

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

// Specify EJS templating engine
app.set("view engine", "ejs");
// First one is name second one is value
// it means views of ejs will be stored in /View/html directory
app.set("views", "View/html");

const adminRoute = require("./Controller/routes/adminRoute");
const shopRoute = require("./Controller/routes/shopRoute");
const authRoute = require("./Controller/routes/authRoute");
const NoRoute = require("./Controller/routes/NoRoute");

const errorPageMiddleWare = require("./Middleware/errorPageMiddleware");

// Express-Session-Keep-Cookie-in-req.session
// This is used to keep session for chosen admin
// Store sessions in MongoDB
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10800000 }, // Session timeout is 3 hours in ms.
  })
);

// Express-Flash-Keep-Session-in-req.flash
app.use(flash());

// Express-Session-Keep-Cookie-in-req.session
app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = null;
    req.session.userName = "No One";
    req.session.userEmail = null;
    req.session.adminId = null;
  }

  next();
});

// Extra layer "/admin"
// Route only has "/add-product"
// Combines to the Route /admin/add-product
// Instead of app.use and router file, we could have also used app.get
app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

// 404-Page
// Unspecified routes, 404 page
// Instead of app.use and router file, we could have also used app.get
app.use(NoRoute);

// Error-Page-Middleware
app.use(errorPageMiddleWare);

// Mongoose-Connect-Database
mongoose
  .connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
