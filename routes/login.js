var express = require('express');
var router = express.Router();

var userEmail;
var userPassword;

router.get('/', (req, res, next) => {
   res.render('login', {title: 'Login'});
});

router.post('/', (req, res, next) => {
   console.log(`Email: ${req.body.email}\nPassword: ${req.body.password}`);
   res.send('User credentials received.');
});

module.exports = router;