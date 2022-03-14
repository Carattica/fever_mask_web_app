const express = require('express');
const router = express.Router();
const Violation = require('../models/Violation');
const {forwardAuthenticated, ensureAuthenticated} = require('../config/auth');

// routes to various pages in the web app
// makes sure user is authenticated with each request before redirecting
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {error: ''}));
router.get('/control_access', ensureAuthenticated, (req, res) => res.render('control_access', {status: '', users: ''}));

router.post('/violations_home', (req, res) => {
    const filter = req.body['filter'];
    var search;
    if (filter === 'Mask' || filter === 'Fever') search = {'violationType': filter};
    else if (filter === undefined) search = {};
    else search = {'location': filter};

    Violation.find(search).sort({'date': -1}).sort({'time': -1}).then(violation => {
        if (violation) {
            console.log(`> ${violation.length} VIOLATIONS FOUND`);
            res.render('violations_home', {vios: violation, vioNum: violation.length});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/violations_home');
        }
    });
});

// get all violations and sort by date, time
router.get('/violations_home', ensureAuthenticated, (req, res) => {
    Violation.find({}).sort({'date': -1}).sort({'time': -1}).then(violation => {
        if (violation) {
            // get this loop to EJS side to display in HTML list
            console.log(`> ${violation.length} VIOLATIONS FOUND`);
            res.render('violations_home', {vios: violation, vioNum: violation.length});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/login');
        }
    });
});

function dateToString(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return mm + '-' + dd + '-' + yyyy;
}

router.get('/violations_weekly', ensureAuthenticated, (req, res) => {
    var today = new Date();

    if (today.getDay() == 0) {  // Sunday, get latest week
        var upperLimit = new Date();  // for querying less than
        var dayBefore = new Date();  // just for date reading, not querying
        dayBefore.setDate(upperLimit.getDate() - 1);

        var lowerLimit = new Date();
        lowerLimit.setDate(lowerLimit.getDate() - 7);
    }
    else {  // not Sunday, get last FULL week
        var upperLimit = new Date();  // for querying less than
        upperLimit.setDate(upperLimit.getDate() - today.getDay());
        var dayBefore = new Date();  // just for date reading, not querying
        dayBefore.setDate(upperLimit.getDate() - 1);

        var lowerLimit = new Date();
        lowerLimit.setDate(lowerLimit.getDate() - (7 + today.getDay()));
    }

    console.log(`> Loading Weekly Report For: ${dateToString(lowerLimit)} to ${dateToString(dayBefore)}`);

    // on Sunday, get report from previous Sunday to Saturday (yesterday) !!!!below as if it was sunday the 13th!!!!
    Violation.find({'date': {$gte: dateToString(lowerLimit), $lt: dateToString(upperLimit)}}).sort({'date': 1}).sort({'time': 1}).then(violation => {
        if (violation) {
            // get this loop to EJS side to display in HTML list
            console.log(`> ${violation.length} VIOLATIONS FOUND`);
            res.render('violations_weekly', {vios: violation, lower: dateToString(lowerLimit), upper: dateToString(dayBefore)});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/login');
        }
    });
});

module.exports = router;