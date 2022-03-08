const express = require('express');
const router = express.Router();
const Violation = require('../models/Violation');
const {forwardAuthenticated, ensureAuthenticated} = require('../config/auth');

// routes to various pages in the web app
// makes sure user is authenticated with each request before redirecting
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {error: ''}));
router.get('/control_access', ensureAuthenticated, (req, res) => res.render('control_access'));

// get all violations and sort by date, time
router.get('/violations_home', ensureAuthenticated, (req, res) => {
    Violation.find({}).sort({'date': 1}).sort({'time': 1}).then(violation => {
        if (violation) {
            // get this loop to EJS side to display in HTML list
            console.log('VIOLATIONS FOUND:');
            for (let i = 0; i < violation.length; i++) {
                console.log(violation[i]['violationType'], violation[i]['imageUrl'], violation[i]['time'], violation[i]['date'], violation[i]['location']);
            }
            res.render('violations_home', {vios: violation});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/login');
        }
    });
});

// NEED TO SORT WEEKLY
// POSSIBLY CHANGE THE DATE AND TIME TYPE IN MONGODB
router.get('/violations_weekly', ensureAuthenticated, (req, res) => {
    Violation.find({}).sort({'date': 1}).sort({'time': 1}).then(violation => {
        if (violation) {
            // get this loop to EJS side to display in HTML list
            console.log('VIOLATIONS FOUND:');
            for (let i = 0; i < violation.length; i++) {
                console.log(violation[i]['violationType'], violation[i]['imageUrl'], violation[i]['time'], violation[i]['date'], violation[i]['location']);
            }
            res.render('violations_weekly', {vios: violation});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/login');
        }
    });
});

module.exports = router;