const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const {forwardAuthenticated, ensureAuthenticated} = require('../config/auth');
const { findByIdAndUpdate, findOneAndDelete } = require('../models/User');
router.use(express.json());

// routes to various pages in the web app
// makes sure user is authenticated with each request before redirecting
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {error: ''}));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {error: ''}));

router.get('/control_access', ensureAuthenticated, (req, res) => {
    User.findOne({_id: req.session.passport.user}).then(user => {
        var usrRole;
        if (user.role === 'Developer') {
            usrRole = 'Displaying All Users Who Have Registered For System Access';
            User.find({role: 'Undetermined'}).then(reqUsers => {
                res.render('control_access', {status: usrRole, users: reqUsers});
            });
        }
        else {
            usrRole = 'You Do Not Have Permission To Control This Page';
            res.render('control_access', {status: usrRole, users: ''})
        }
    });
});

// POST REQUEST FOR CONTROL ACCESS
router.post('/control_access', (req, res) => {
    const email = Object.keys(req.body).toString();
    const role = req.body[email];

    if (role === 'Administrator' || role === 'Developer') {
        User.findOneAndUpdate({email: email}, {role: role}).then(() => {
            console.log(`> ${role} permission granted to ${email}`);
        });
        // SEND EMAIL
    }
    else {
        User.findOneAndDelete({email: email}).then(() => {
            console.log(`> Website access denied to ${email}`);
        });
        // SEND EMAIL
    }

    res.redirect('/control_access');
});

// user registration
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;

    // variable for posting error messages in an alert
    var error;

    // password criteria
    var criteria = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[_!@#$%&?]).+$"
    );

    // password validation helper functions
    const validPsuEmail = (str, psuEdu) => {
        return str.indexOf(psuEdu, str.length - psuEdu.length) !== -1;
    }
    function doubleAt(str, count = 0) {
        for (var i = 0; i < str.length - 1; i++) {
            if (str[i] === '@') count++;
        }
        if (count > 1) return true;
        else return false;
    }

    // ensuring the email is in correct format
    // ensuring the email is a PSU email
    // password must match
    // passwords must contain a capital letter, a number, and a symbol while having a length of at least 8 characters
    if (password !== password2) error = 'Entered passwords do not match.';
    if (!criteria.test(password))  error = 'Password must contain at least one special character: _!@#$%&?';
    if (password.length < 8)  error = 'Password must be at least 8 characters in length.';
    if (!validPsuEmail(email, '@psu.edu')) error = 'The email must be a Penn State email.';
    if (doubleAt(email)) error = 'Invalid email format';

    // checking if the name field is empty
    if (!name) error = 'You must enter a name.';

    // render the page with an error message if there is one
    if (error) res.render('register', {error: error});

    // if email and passwords meet criteria
    else {
        User.findOne({email: email}).then(user => {
            if (user) {  // if email already exists
                res.render('register', {error: 'An account with that email already exists.'});
            }
            else {  // if all registration conditions are met, create the user in the database and have them log in
                // const role = 'administrator';
                const role = 'undetermined';
                const newUser = new User({name, email, password, role});  // create the new user in the DB
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
    User.findOne({email: req.body.email}).then(user => {
        if (user.role === 'Undetermined') {
            res.render('login', {error: 'You have not been granted permissions yet.'});
        }
        else {
            passport.authenticate('local', {successRedirect: '/violations_home', failureRedirect: '/login'})(req, res, next);
        }
    });
});

// log the user out and return to login page
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;