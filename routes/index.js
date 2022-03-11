var express = require('express');
var router = express.Router();
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => {
    res.render('login', {error: ''});
});

module.exports = router;