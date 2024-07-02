// install requirements
const express = require("express");
const router = express.Router();
const Campground = require("../models/campground.js");
const User = require("../models/user.js");
const ObjectId = require("mongodb").ObjectId;
// error handling functions
const validateCampground = require("../utils/validateCampground");
const catchAsync = require("../utils/catchAsync.js");
// middleware
const { isLoggedIn, isAuthor } = require("../middleware.js");

// controllers
const campgroundController = require("../controllers/campgroundController.js");

// image upload
const multer = require("multer");
const { storage } = require("../cloudinary/index.js");
const upload = multer({ storage });

router
  .route("/")
  // INDEX
  .get(catchAsync(campgroundController.index))
  // CREATE
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundController.createCamp)
  );

// CREATE page (2 routes - get and post)
// THIS NEEDS TO COME BEFORE THE SHOW PAGE
router.get("/new", isLoggedIn, campgroundController.newForm);

router
  .route("/:id")
  .get(catchAsync(campgroundController.showCamp))
  .patch(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundController.editCamp)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCamp));

// EDIT page (2 routes, method override)
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor, // don't show edit page unless logged in user is the owner
  catchAsync(campgroundController.editForm)
);

module.exports = router;
