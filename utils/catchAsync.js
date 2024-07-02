// catchAsync runs the async function
// (for example to GET or POST something),
// and then if it encounters an error it passes it to next()
// so it prevents the server from crashing at an error

module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
