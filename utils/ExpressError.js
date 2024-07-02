// Express has a built-in AppError class
// we extend this default error class with our own class

class ExpressError extends Error {
  constructor(message, statusCode) {
    // super allows us to inherit the 'message' and 'statusCode' from the parent Error class
    // then this.message sets the current arguments to the inherited arguments
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
