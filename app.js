var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();

// passport config
require('./config/passport')(passport);

// db config
// connect to mongodb
mongoose.connect(process.env.DB,{ useNewUrlParser: true ,useUnifiedTopology: true})
    .then(() => console.log('Connected to the Users DB'))
    .catch(err => console.log(err));

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
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/users.js'));

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
