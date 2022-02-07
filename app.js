var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var mongoose = require('mongoose');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
//
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/node-auth')
//     .then(() => console.log('Mongoose Conected.'))
//     .catch((err) => console.error(err));

// getting the router files
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var violationsHomeRouter = require('./routes/violations_home');
var registerRouter = require('./routes/register');
var violationsWeeklyRouter = require('./routes/violations_weekly');
var controlAccessRouter = require('./routes/control_access');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// integrating the router files and sending paths
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/violations_home', violationsHomeRouter);
app.use('/register', registerRouter);
app.use('/violations_weekly', violationsWeeklyRouter);
app.use('/control_access', controlAccessRouter);

// // init passport and express-session
// app.use(require('express-session')({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
//
// // passport config
// var User = require('./models/User');
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
