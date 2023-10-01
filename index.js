const express = require("express");
const path = require("path");

// Mongoose-Connect-Database
const mongoose = require("mongoose");

// Express-Session-Keep-Cookie-in-req.session
// This is used to keep session for chosen admin
const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);

// Mongoose-Connect-Database
// Allows .env file to be used
require("dotenv").config();

// This is used to connect database
const dbAdminOperation = require("./Model/operations/dbAdminOperation");

const app = express();

const store = new MongoDBStore({
  uri: process.env.URL,
  collection: "sessions"
});

// Express body parsing
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

// Specify CSS file location
app.use(express.static(path.join(__dirname, "View/styles")));

// Specify EJS templating engine
app.set("view engine", "ejs");
// First one is name second one is value
// it means views of ejs will be stored in /View/html directory
app.set("views", "View/html");

const adminRoute = require("./Controller/routes/adminRoute");
const shopRoute = require("./Controller/routes/shopRoute");
const authRoute = require("./Controller/routes/authRoute");
const NoRoute = require("./Controller/routes/NoRoute");


// Express-Session-Keep-Cookie-in-req.session
// This is used to keep session for chosen admin
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

// Express-Session-Keep-Cookie-in-req.session
app.use(async (req, res, next) => {

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

// Unspecified routes, 404 page
// Instead of app.use and router file, we could have also used app.get
app.use(NoRoute);

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
