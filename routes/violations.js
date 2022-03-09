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
    Violation.find({}).sort({'date': -1}).sort({'time': -1}).then(violation => {
        if (violation) {
            // get this loop to EJS side to display in HTML list
            console.log('VIOLATIONS FOUND:');
            for (let i = 0; i < violation.length; i++) {
                console.log('>', violation[i]['violationType'], violation[i]['imageUrl'], violation[i]['time'], violation[i]['date'], violation[i]['location']);
            }
            res.render('violations_home', {vios: violation});
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

/*
1. go to weekly report page
2. check to see if sunday (function)
3. if it is, calculate the dates and query between the two (function)
4. hold new data in a list
5.. else, just hold the previous week's stuff up there from previous list
    > find num of current day of week (n)
    > use it to calculate LAST weeks day ranges and just display those (today - 7+n, today - n]
    > this will act as the 'storage' of previous week when update not ready

*/

router.get('/violations_weekly', ensureAuthenticated, (req, res) => {

    var today = new Date();

    if (today.getDay() == 0) {  // Sunday, get last week
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
            console.log('VIOLATIONS FOUND:');
            for (let i = 0; i < violation.length; i++) {
                console.log('>', violation[i]['violationType'], violation[i]['imageUrl'], violation[i]['time'], violation[i]['date'], violation[i]['location']);
            }
            res.render('violations_weekly', {vios: violation, lower: dateToString(lowerLimit), upper: dateToString(dayBefore)});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/login');
        }
    });
});

module.exports = router;