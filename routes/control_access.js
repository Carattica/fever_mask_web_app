var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.render('control_access', {title: 'Violation System'});
});

module.exports = router;