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

router.get('/violations_home', ensureAuthenticated, (req, res) => {
    Violation.findOne({violationType: 'mask'}).then(violation => {
        if (violation) {
            res.render('violations_home', {vio: violation['violationType'], img: violation['imageUrl']});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/login');
        }
    });
});

module.exports = router;