const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const {forwardAuthenticated, ensureAuthenticated} = require('../config/auth');

// routes to various pages in the web app
// makes sure user is authenticated with each request before redirecting
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {error: ''}));
router.get('/violations_weekly', ensureAuthenticated, (req, res) => res.render('violations_weekly'));
router.get('/violations_home', ensureAuthenticated, (req, res) => res.render('violations_home'));
router.use('/violations_home', ensureAuthenticated, require('./violations'));
router.get('/control_access', ensureAuthenticated, (req, res) => res.render('control_access'));

// user registration
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    // variable for posting error messages in an alert
    // criteria for meeting password rules
    // ensuring the email is of PSU domain
    var error;
    var criteria = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[_!@#$%&?]).+$"
    );
    const validPsuEmail = (str, psuEdu) => {
        return str.indexOf(psuEdu, str.length - psuEdu.length) !== -1;
    }

    // ensuring the email is a PSU email
    // password must match
    // passwords must contain a capital letter, a number, and a symbol while having a length of at least 8 characters
    if (password !== password2) error = 'Entered passwords do not match.';
    if (!criteria.test(password))  error = 'Password must contain at least one special character: _!@#$%&?';
    if (password.length < 8)  error = 'Password must be at least 8 characters in length.';
    if (!validPsuEmail(email, '@psu.edu')) error = 'The email must be a Penn State email.';

    // render the page with an error message if there is one
    if (error) res.render('register', {error: error});

    // if email and passwords meet criteria
    else {
        User.findOne({email: email}).then(user => {
            if (user) {  // if email already exists
                res.render('register', {error: 'An account with that email already exists.'})
            }
            else {  // if all registration conditions are met, create the user in the database and have them log in
                const newUser = new User({name, email, password});  // create the new user in the DB
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {  // encrypt the user's password
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {res.redirect('/login');}).catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// successful login takes user to violations
// failed login keeps user at login page
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {successRedirect: '/violations_home', failureRedirect: '/login'})(req, res, next);
});

// log the user out and return to login page
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;