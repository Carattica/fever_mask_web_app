require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();
var browserTab = browser.forBrowser('chrome').build();

const LOGIN_URL = 'http://localhost:3000/login';
const REG_URL = 'htttp://localhost:3000/register';  // need to navigate to here instead of loading
const VIO_URL = 'http://localhost:3000/violations_home';

var testsPassed = 0;

// test user credentials
var email = 'tester@psu.edu';
var password = 'Testing11!';
var unregisteredEmail = 'fake@psu.edu';
var emptyEmail = '';
var invalidPassword = '1testing1';