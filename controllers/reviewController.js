const Review = require("../models/review");
const Campground = require("../models/campground");

// POST ROUTE
const postReview = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  const review = new Review(req.body.review);
  // add user to review
  review.author = req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("success", "Successfully posted your review");
  res.redirect(`/campgrounds/${id}`);
};

// DELETE ROUTE
const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  // use the $pull method to remove all reviews that have reviewId
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "successfully deleted your review");
  res.redirect(`/campgrounds/${id}`);
};

module.exports = { postReview, deleteReview };
