const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const emailUser = require('../config/mailer');
const User = require('../models/User');
const {forwardAuthenticated, ensureAuthenticated} = require('../config/auth');
const { findByIdAndUpdate, findOneAndDelete } = require('../models/User');

// check if it is time to send the Weekly Report
// Sunday 8:00 PM
var weeklyReportTime = new Date();
if (weeklyReportTime.getDay() == 0 && weeklyReportTime.getHours() == 20) {
    console.log('> Sending the Weekly Report email notifications...');
    User.find({}).then(user => {
        if (user) {
            var allEmails = '';
            for (i in user) {
                allEmails += user[i].email.toString() + ', '
            }
            allEmails = allEmails.slice(0, -2);
            emailUser(allEmails, 'Weekly Report: Fever Mask Mandate System', 'The Weekly Report is updated and ready to view.');
        }
        else {
            console.log('Error fetching users from Users Database.');
        }
    });
}

// routes to various pages in the web app
// makes sure user is authenticated with each request before redirecting
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {error: ''}));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {error: ''}));

// GET: displays all current users awaiting access
router.get('/control_access', ensureAuthenticated, (req, res) => {
    User.findOne({_id: req.session.passport.user}).then(user => {
        if (user) {
            var usrRole;
            if (user.role === 'Developer') {
                usrRole = 'Displaying All Users Who Have Registered for System Access';
                User.find({role: 'Undetermined'}).then(reqUsers => {
                    res.render('control_access', {status: usrRole, users: reqUsers});
                });
            }
            else {
                usrRole = 'You Do Not Have Permission To Control This Page';
                res.render('control_access', {status: usrRole, users: ''})
            }
        }
        else {
            console.log('Error fetching users from Users Database.');
            res.redirect('/violations_home');
        }
        
    });
});

// POST: handles what happens after developer changes user access role
router.post('/control_access', (req, res) => {
    const email = Object.keys(req.body).toString();
    const role = req.body[email];

    if (role === 'Administrator' || role === 'Developer') {
        User.findOneAndUpdate({email: email}, {role: role}).then(() => {
            console.log(`> ${role} permission granted to ${email}`);
        });
        emailUser(email, 'Access Granted', `You have been granted ${role} permissions to the Fever and Mask Mandate System website. You may now log in.`);
    }
    else {
        User.findOneAndDelete({email: email}).then(() => {
            console.log(`> Website access denied to ${email}`);
        });
        emailUser(email, 'Access Denied', `You have been denied permissions to the Fever and Mask Mandate System website. No further action needed.`);
    }

    res.redirect('/control_access');
});

// POST: user registration
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
                const role = 'Undetermined';
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

// POST: successful login takes user to violations, failed login keeps user at login page
router.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            if (user.role === 'Undetermined') {
                res.render('login', {error: 'You have not been granted permissions yet.'});
            }
            else {
                passport.authenticate('local', {successRedirect: '/violations_home', failureRedirect: '/login'})(req, res, next);
            }
        }
        else {
            console.log('Error fetching users from Users Database.');
            res.redirect('/login');
        }
    });
});

// GET: log the user out and return to login page
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;