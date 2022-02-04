var express = require('express');
var router = express.Router();

// redirect to login page
router.get('/', (req, res) => {
  res.redirect('/login');
})

module.exports = router;
