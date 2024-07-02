// install requirements
const express = require("express");
const router = express.Router({ mergeParams: true }); // need to get the :id parameter
const User = require("../models/user.js");
const passport = require("passport");
const { storeReturnTo } = require("../middleware.js");
// error handling functions
const catchAsync = require("../utils/catchAsync.js");

// controllers
const userController = require("../controllers/userController.js");

// REGISTRATION
router.get("/register", userController.registerForm);
router.post("/register", catchAsync(userController.registerUser));

// LOGIN
router.get("/login", userController.loginForm);
router.post(
  "/login",
  // use storeReturnTo middleware to save the returnTo url from session to res.locals
  storeReturnTo,
  // passport.authenticate logs user in and clears req.session
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.loginUser
);

// LOGOUT
router.post("/logout", userController.logoutUser);

module.exports = router;
