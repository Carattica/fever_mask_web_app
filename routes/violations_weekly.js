var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.render('violations_weekly', {title: "Weekly Violations"});
});

module.exports = router;