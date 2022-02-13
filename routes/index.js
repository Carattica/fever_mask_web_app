var express = require('express');
var router = express.Router();
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/violations_home', ensureAuthenticated, (req, res) => {
        res.render('violations_home');
});

module.exports = router;