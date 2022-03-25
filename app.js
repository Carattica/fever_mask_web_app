require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');

var app = express();  // create express object

// passport config for authentication
require('./config/passport')(passport);

// view engine setup
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// express session
app.use(session({secret: 'secret', resave: true, saveUninitialized: true}));
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// integrating the router files and sending paths
// these will handle all main fucntionality of the app
app.use('/', require('./routes/index.js'));  // redirects to login page
app.use('/', require('./routes/users.js'));  // all user-related actions
app.use('/', require('./routes/violations.js'));  // all violation db related actions

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

// to run the app: npm start
// MongoDB password: SeniorDesign11!