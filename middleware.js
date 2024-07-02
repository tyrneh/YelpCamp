const Campground = require("./models/campground");
const Review = require("./models/review");

// checking logged in middleware
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

// if there is a returnTo object, then store it in res.locals
const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// we need to find the campground in our database, and check if the author is equal to the logged in user
const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const savedCamp = await Campground.findById(id);
  if (!savedCamp.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  // otherwise, then user has permission, so next
  next();
};

// checking if the user is the author of the review
const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports = { isLoggedIn, storeReturnTo, isAuthor, isReviewAuthor };
