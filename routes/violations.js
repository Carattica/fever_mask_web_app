const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Violation = require('../models/Violation');
const {forwardAuthenticated, ensureAuthenticated} = require('../config/auth');

// routes to various pages in the web app
// makes sure user is authenticated with each request before redirecting
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {error: ''}));
router.get('/violations_weekly', ensureAuthenticated, (req, res) => res.render('violations_weekly'));
router.get('/control_access', ensureAuthenticated, (req, res) => res.render('control_access'));

// time, date, location, type of offense
router.get('/violations_home', ensureAuthenticated, (req, res) => {
    Violation.find({}).then(violation => {
        if (violation) {
            // get this loop to EJS side to display in HTML list
            console.log('VIOLATIONS FOUND:');
            for (let i = 0; i < violation.length; i++) {
                console.log(violation[i]['violationType'], violation[i]['imageUrl']);
            }
            // res.render('violations_home', {vio: violation[1]['violationType'], img: violation[1]['imageUrl']});
            res.render('violations_home', {vios: violation});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/login');
        }
    });
});

module.exports = router;