const { reviewSchema } = require("./JoiSchemasValidation.js");
const ExpressError = require("./ExpressError.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // "error.details" is an array of objects, so we want to map over them
    // and return a single new array that we turn into a string
    const msg = error.details.map((el) => el.message).join(",");
    console.log(msg);
    // if an error is encountered, it throws an ExpressError
    // and the rest of the code (contact with server) is stopped
    throw new ExpressError(msg, 400);
  } else {
    // if no error is encountered, continue with the POST/PATCH request
    next();
  }
};

module.exports = validateReview;
