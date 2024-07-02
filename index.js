// ----------------------------------------------- //
// ----------------Setting up requirements-------------- //
// ----------------------------------------------- //
// if we're not in development mode, then require the dotenv package
// which will take the env variables we defined and add them to our files
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const favicon = require('serve-favicon');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user.js');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const MongoStore = require('connect-mongo');

//-- getting custom error handling files --//
const catchAsync = require('./utils/catchAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const validateReview = require('./utils/validateReview.js');

// -- setting up mongoose (database connection) --//
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review.js');

const dbUrl = process.env.MONGO_URL;
// const dbUrl = 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('Database connected');
});

// ---------------Security-------------------- //
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

// ----------------------------------------------- //

const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use tells express to do something on every single request
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.engine('ejs', ejsMate);

// ----------------------------------------------- //

// serving static assets
app.use(express.static(path.join(__dirname, 'public')));

// favicon
app.use(favicon(__dirname + '/public/imgs/favicon.png'));

// using mongo to store session
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: 'thisshouldbeabettersecret!',
  },
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});

// serving session
const sessionConfig = {
  store,
  name: 'ses',
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true  // only https is allowed
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expires in a week, since Date.now() is in milliseconds
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// -----> USING PASSPORT
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions. Session must be used before this

// use Passport's LocalStrategy, use its authenticate() method located on the User mongoose model
passport.use(new passportLocal(User.authenticate()));
// serialization refers to storing a user in the session
passport.serializeUser(User.serializeUser());
// deserialize refers to unstoring a user's session
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req, res, next) => {
  // store the url to the page the user was trying to go to
  // then after the user logs in, you can redirect them to their original page
  // (if coming from login or home page, then don't redirect)
  if (!['/login', '/'].includes(req.originalUrl)) {
    req.session.previousReturnTo = req.session.returnTo; // store the previous url
    req.session.returnTo = req.originalUrl; // asign a new url
    console.log('Previous return to: ', req.session.previousReturnTo);
    console.log('New return to: ', req.session.returnTo);
  }
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  // allows all routes to have access to the currentUser info (and whether user is logged in)
  res.locals.currentUser = req.user;
  next();
});

// ---------------CAMPGROUNDS ROUTES------------------- //
app.get('/', (req, res) => {
  res.render('campgrounds/home.ejs');
});

const campgroundRoutes = require('./routes/campgroundRoutes.js');
app.use('/campgrounds', campgroundRoutes);

// ---------------REVIEWS ROUTES------------------- //
const reviewRoutes = require('./routes/reviewRoutes.js');
app.use('/campgrounds/:id/reviews', reviewRoutes);

// ---------------USER ROUTES------------------- //
const userRoutes = require('./routes/userRoutes.js');
app.use('/', userRoutes);

// ----------------------------------------------- //
// ---------------ERRORS------------------- //
// ----------------------------------------------- //

// catching links to pages that don't exist
// app.all() will catch all requests, to all /* other urls
// e.g. if you go to "/nonexistentpage" then it will display 404
app.all('*', (req, res, next) => {
  req.session.returnTo = req.session.previousReturnTo;
  console.log('previous returnTo reset to: ', req.session.returnTo);
  next(new ExpressError('Page not found', 404));
});

// catching errors
app.use((err, req, res, next) => {
  // destructuring status and message variables from the err object
  //  this sets the default status to 500
  const { status = 500 } = err;
  if (!err.message) err.message = 'Oh no, something went wrong!';
  res.status(status).render('error.ejs', { err });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
