const User = require("../models/user");

// REGISTER ROUTE
const registerForm = (req, res) => {
  res.render("users/register.ejs");
};

const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    // create a user object with just the email and username
    const user = new User({ email, username });
    // use Passport to register a new user, given the password
    //    this automatically saves to mongoose
    const registeredUser = await User.register(user, password);
    // auto login after registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registered. Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

// LOGIN ROUTE
const loginForm = (req, res) => {
  res.render("users/login.ejs");
};
const loginUser = (req, res) => {
  // code makes it in here only if it passes the authenticate() middleware
  req.flash("success", "welcome back!");

  // now we can use res.locals.returnTo to redirect user after login
  console.log(req.session.returnTo);
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  console.log(redirectUrl);
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// LOGOUT ROUTE
const logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "Logged out");
  res.redirect("/campgrounds");
};

module.exports = {
  registerForm,
  registerUser,
  loginForm,
  loginUser,
  logoutUser,
};
