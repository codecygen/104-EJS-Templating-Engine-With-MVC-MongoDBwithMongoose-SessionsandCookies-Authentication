const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// CSRF-Attacks-Prevention
const { v4: uuidv4 } = require("uuid");

const dbAdminOperation = require("../../Model/operations/dbAdminOperation");
const dbAuthOperation = require("../../Model/operations/dbAuthOperation");

const sendPassRecoveryEmail = require("./utils/sendPassRecoveryEmail");

exports.getLoginPage = async (req, res, next) => {
  const queryOutput = req.query.message;
  let pageMessage;

  switch (queryOutput) {
    case "no-user":
      pageMessage = "Please register first!";
      break;

    case "wrong-pass":
      pageMessage = "Your password is incorrect!";
      break;

    default:
      pageMessage = null;
  }

  res.render("login", {
    pagePath: "/login",
    renderTitle: "Login",
    pageMessage: pageMessage,
    // selectedUser: res.locals.selectedUser,
  });
};

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

exports.postLogout = async (req, res, next) => {
  req.session.userId = null;
  req.session.userName = "No One";
  req.session.userEmail = null;
  req.session.adminId = null;

  res.redirect("/login");
};

exports.getSignUpPage = async (req, res, next) => {
  const queryOutput = req.query.message;
  let pageMessage;

  switch (queryOutput) {
    case "empty-fields":
      pageMessage = "Please fill out the required fields!";
      break;

    case "invalid-email":
      pageMessage = "Please enter a valid email address!";
      break;

    case "password-mismatch":
      pageMessage = "Please make sure passwords match!";
      break;

    case "duplicate-email":
      pageMessage = "Email is already registered!";
      break;

    case "server-error":
      pageMessage = "Something went wrong with database!";
      break;

    case "successful":
      pageMessage = "Congratulations! You successfully registered!";
      break;

    default:
      pageMessage = null;
  }

  res.render("signup", {
    pagePath: "/signup",
    renderTitle: "Signup",
    signupFeedback: false,
    pageMessage: pageMessage,
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

  // Password hashing and salting
  const saltRounds = 12;

  bcrypt.hash(enteredPass, saltRounds, async (err, hashedPass) => {
    if (err) {
      console.error(err);
      return;
    }

    const newUserData = {
      userName: enteredName,
      userEmail: enteredEmail,
      password: hashedPass,
      adminId: isAdminBoxChecked ? new mongoose.Types.ObjectId() : null,
      userCart: [],
      passResetData: { resetToken: null, tokenExpiry: null },
    };

    const registerResult = await dbAuthOperation.registerUser(newUserData);

    switch (registerResult) {
      case "successful":
        validityMessage = "successful";
        break;

      case "duplicate-email":
        validityMessage = "duplicate-email";
        break;

      default:
        validityMessage = "server-error";
    }

    await res.redirect(
      `/signup?message=${encodeURIComponent(validityMessage)}`
    );
  });
};

exports.getResetPassPage = (req, res, next) => {
  let pageMessage;

  res.render("password_reset/index", {
    pagePath: "/password_reset",
    renderTitle: "Reset Password",
    pageMessage: pageMessage,
    // selectedUser: res.locals.selectedUser,
  });
};

exports.postResetPassPage = async (req, res, next) => {
  const enteredEmail = req.body["entered-email"];

  const emailValidityHandler = (email) => {
    const emailTest = email
      .toString()
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

    return emailTest;
  };

  // Submitted email is in the wrong format!
  if (!emailValidityHandler(enteredEmail)) {
    console.log("Wrong email!");
    return;
  }

  const foundUser = await dbAdminOperation.getOneUserWithEmail(enteredEmail);

  // User not found!
  if (!foundUser) {
    return res.redirect("/password_reset");
  }

  const passResetToken = crypto.randomBytes(32).toString("hex");

  foundUser.passResetData.resetToken = passResetToken;

  // Created token will only be valid for 10 mins!
  foundUser.passResetData.tokenExpiry = new Date(Date.now() + 1000 * 60 * 10);

  // Update passResetData in database for the user
  await dbAdminOperation.updateUserData(foundUser);

  // Send email to the user
  await sendPassRecoveryEmail(enteredEmail, passResetToken);

  res.redirect("/");
};

exports.getNewPassPage = async (req, res, next) => {
  let pageMessage;
  const resetParams = req.params.resetParams;

  const linkParams = {
    token: resetParams.split(":")[0],
    email: resetParams.split(":")[1],
  };

  const foundUser = await dbAdminOperation.getOneUserWithEmail(
    linkParams.email
  );

  if (
    !foundUser ||
    !foundUser.passResetData ||
    !foundUser.passResetData.resetToken ||
    !foundUser.passResetData.tokenExpiry ||
    foundUser.passResetData.resetToken !== linkParams.token ||
    foundUser.passResetData.tokenExpiry < new Date()
  ) {
    res.status(404).render("404", {
      renderTitle: "No Page Found!",
      pagePath: "NA",
      // router.use(populateSelectedUser); // this middleware populates res.locals
      // because it is stored in res.locals, res.render template
      // can reach to selectedUser that is in res.locals
      // selectedUser: res.locals.selectedUser,
    });
  }

  res.render("password_reset/reset_params", {
    pagePath: "/password_reset/reset_params",
    renderTitle: "Enter New Password",
    pageMessage: pageMessage,
    // selectedUser: res.locals.selectedUser,
  });
};
