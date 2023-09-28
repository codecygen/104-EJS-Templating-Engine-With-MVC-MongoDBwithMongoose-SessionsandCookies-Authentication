const mongoose = require("mongoose");
const dbAdminOperation = require("../../Model/operations/dbAdminOperation");

exports.getLoginPage = async (req, res, next) => {
  // Gets cookie from front end with Get request for the page.
  // req.get("Cookie") will only return not expired cookies
  // if (req.get("Cookie")) {
  // console.log(req.get("Cookie"));
  // console.log(req.cookies);
  // Output:
  // connect.sid=s%3AEc9Ke1LRkapkR1oCWsJhLAQ135sZJvip.FOzakumJ0zFCgJNOUdqtiG0j%2BCyRLGLTF0qrw5Rm88E; loggedIn=true
  // }

  res.render("login", {
    pagePath: "/login",
    renderTitle: "Login",
    // selectedUser: res.locals.selectedUser,
  });
};

exports.postLoginPage = async (req, res, next) => {
  const {
    "entered-username": enteredUsername,
    "entered-password": enteredPassword,
  } = req.body;

  const foundUser = await dbAdminOperation.checkLogin(
    enteredUsername,
    enteredPassword
  );

  if (!foundUser) {
    return;
  }

  req.session.userId = foundUser._id;
  req.session.userName = foundUser.userName;
  req.session.userEmail = foundUser.userEmail;
  req.session.adminId = foundUser.adminId;

  res.redirect("/");

  // req.session.isLoggedIn = true;

  // Sets cookie upon post request to the front end.
  // loggedIn=true
  // It will expire 2023/09/25 00:00AM UTC
  // const expiryDate = new Date("2050-09-25T00:00:00Z").toUTCString();
  // res.setHeader("Set-Cookie", `loggedIn=true; Expires=${expiryDate}`);

  // Max-Age sets the expiry of the cookie in seconds
  // Even though this cookie will be invalid after 10 seconds
  // It will still stay in browser but will be deleted by browser eventually
  // const expirySecond = 10;
  // res.setHeader("Set-Cookie", `tenSeconds=true; Max-Age=${expirySecond}`);
};

exports.postLogout = async (req, res, next) => {
  req.session.userId = null;
  req.session.userName = "No One";
  req.session.userEmail = null;
  req.session.adminId = null;

  res.redirect("/login");
};

exports.getSignUpPage = async (req, res, next) => {
  res.render("signup", {
    pagePath: "/signup",
    renderTitle: "Signup",
    signupFeedback: false,
    // selectedUser: res.locals.selectedUser,
  });
};

exports.postSignUpPage = async (req, res, next) => {
  const {
    "entered-username": enteredName,
    "entered-email": enteredEmail,
    "entered-password": enteredPass,
    "entered-password-repeat": enteredPassConfirm,
    "is-admin": adminCheckbox,
  } = req.body;

  const isAdminBoxChecked = adminCheckbox === "on" ? true : false;

  let validityMessage;

  // VALIDATION OF INPUTS
  const emailValidityHandler = (email) => {
    const emailTest = email
      .toString()
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

    return emailTest;
  };

  if (!enteredName || !enteredEmail || !enteredPass || !enteredPassConfirm) {
    validityMessage = "empty-fields";
  } else if (!emailValidityHandler(enteredEmail)) {
    validityMessage = "invalid-email";
  } else if (enteredPass !== enteredPassConfirm) {
    validityMessage = "password-mismatch";
  } else {
    validityMessage = "successful";
  }
  // VALIDATION OF INPUTS

  const newUserData = {
    userName: enteredName,
    userEmail: enteredEmail,
    password: enteredPass,
    adminId: isAdminBoxChecked ? new mongoose.Types.ObjectId() : null,
  };

  console.log(newUserData);

  res.redirect(`/signup?message=${encodeURIComponent(validityMessage)}`);
};
