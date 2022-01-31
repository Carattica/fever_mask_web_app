var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Welcome to the violations page.');
});

module.exports = router;