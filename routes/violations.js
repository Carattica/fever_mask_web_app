const express = require('express');
const router = express.Router();
const Violation = require('../models/Violation');
const User = require('../models/User');
const {forwardAuthenticated, ensureAuthenticated} = require('../config/auth');

// function to convert a DateTime to a String
function dateToString(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return mm + '-' + dd + '-' + yyyy;
}

// function to get all building locations from db to send to filter
function getLocations() {
    var locations = [];
    Violation.find({}).then(violation => {
        if (violation) {
            for (var v in violation) {
                if (locations.indexOf(violation[v].location) === -1) {
                    locations.push(violation[v].location);
                }
            }
        }
        else console.log('Error fetching violations from Violations DB');
    });
    return locations;
}

// routes to various pages in the web app
// makes sure user is authenticated with each request before redirecting
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {error: ''}));
router.get('/control_access', ensureAuthenticated, (req, res) => res.render('control_access', {status: '', users: ''}));

// POST: developer deleting a violation from the database
router.post('/violations_home/delete', (req, res) => {
    // 'null' if a user cancels the deletion action
    // not 'null' if a user confirms the deletion action
    if (req.body.vioId != 'null') {
        // find current user's role
        User.findOne({_id: req.session.passport.user}).then(user => {
            if (user) {
                if (user.role === 'Developer') {
                    Violation.findOneAndDelete({_id: req.body.vioId}) .then(() => {
                        console.log(`> Successfully deleted violation record: ${req.body.vioId}`);
                    });
                }
            }
            else {
                console.log('Error fetching users from Users Database.');
            }
        });
    }

    res.redirect('/violations_home');
});

// POST: filtering the data based on filter dropdown selection
router.post('/violations_home', (req, res) => {
    // get the selected filter from the client
    const filter = req.body['filter'];
    var search;
    if (filter === 'Mask' || filter === 'Fever') search = {'violationType': filter};
    else if (filter === "none") search = {};
    else search = {'location': filter};

    const locFilter = getLocations();

    // find and filter violations based on the filter
    Violation.find(search).sort({'date': -1}).sort({'time': -1}).then(violation => {
        if (violation) {
            console.log(`> ${violation.length} VIOLATIONS FOUND`);
            if (filter === "none") var filterMsg = 'Showing All ' + violation.length + ' Captured Violations';
            else var filterMsg = 'Showing ' + violation.length + ' Violations for Filter: ' + filter;
            res.render('violations_home', {vios: violation, vioMsg: filterMsg, filter: locFilter});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/violations_home');
        }
    });
});

// GET: get all violations and sort by date, then time
router.get('/violations_home', ensureAuthenticated, (req, res) => {
    const locFilter = getLocations();
    Violation.find({}).sort({'date': -1}).sort({'time': -1}).then(violation => {
        if (violation) {
            console.log(`> ${violation.length} VIOLATIONS FOUND`);
            var filterMsg = 'Showing All ' + violation.length +  ' Captured Violations'
            res.render('violations_home', {vios: violation, vioMsg: filterMsg, filter: locFilter});
        }
        else {
            console.log('Error fetching violations from Violations Database.');
            res.redirect('/login');
        }
    });
});

// GET: calculating wekly timeframe and loading the weekly report
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

    console.log(`> Loading Weekly Report for: ${dateToString(lowerLimit)} to ${dateToString(dayBefore)}`);

    // on Sunday, get report from previous Sunday to Saturday
    Violation.find({'date': {$gte: dateToString(lowerLimit), $lt: dateToString(upperLimit)}}).sort({'date': -1}).sort({'time': -1}).then(violation => {
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