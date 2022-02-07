var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res, next) => {
   res.render('login', {title: 'Violation System', errorMsg: ''});
});

router.post('/', (req, res) => {
   var exists = false;  // flag to track if the user exists in the directory

   // open JSON directory containing user credentials
   fs.readFile('./dbs/user_credentials.json', (err, data) => {
      if (err) console.log(err);

      const userCredentialsJson = JSON.parse(data);  // parse the JSON file into a JSON obj

      // search for user credentials in the database
      for (let i in userCredentialsJson) {
         if (JSON.stringify(req.body.email) === JSON.stringify(userCredentialsJson[i]['email']) &&
             JSON.stringify(req.body.psw) === JSON.stringify(userCredentialsJson[i]['password'])) {
            exists = true;
            break;
         }
      }

      if (exists) {
         console.log('Successful Login.');
         res.render('violations_home', {title: 'Violations'});
      }
      else {
         console.log('Unsuccessful Login.');
         res.render('login', {title: 'Violation System', errorMsg: 'Invalid Credentials'});
      }
   });
});

module.exports = router;