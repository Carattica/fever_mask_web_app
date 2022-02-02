var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Weekly Violations Page');
});

module.exports = router;