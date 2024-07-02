// install requirements
const express = require("express");
const router = express.Router({ mergeParams: true }); // need to get the :id parameter
const Review = require("../models/review.js");
const Campground = require("../models/campground.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
// error handling functions
const validateReview = require("../utils/validateReview");
const catchAsync = require("../utils/catchAsync.js");
// controller
const reviewController = require("../controllers/reviewController.js");

// POST ROUTE FOR REVIEWS
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewController.postReview)
);

// DELETE A REVIEW
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewController.deleteReview)
);

module.exports = router;
