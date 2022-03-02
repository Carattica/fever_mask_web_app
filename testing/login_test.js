require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();
var browserTab = browser.forBrowser('chrome').build();

// test user credentials
var email = 'tester@psu.edu';
var password = 'Testing11!';

var tabToOpen = browserTab.get('http://localhost:3000/login');
tabToOpen.then(() => {
    var findTimeOutP = browserTab.manage().setTimeouts({
        implicit: 10000,  // set timeout to 10 seconds
    });
    return findTimeOutP;
})
.then(() => {
    let emailInput = browserTab.findElement(selenium.By.id('emailInput'));
    return emailInput;
})
.then((emailInput) => {
    var fillEmail = emailInput.sendKeys(email);
    return fillEmail;
})
.then(() => {
    console.log('Entered an email for login.');

    var passwordInput = browserTab.findElement(selenium.By.id('passwordInput'));
    return passwordInput;
})
.then((passwordInput) => {
    var fillPassword = passwordInput.sendKeys(password);
    return fillPassword;
})
.then(() => {
    console.log('Entered a password for login.');

    var loginButton = browserTab.findElement(selenium.By.id('loginButton'));
    return loginButton;
})
.then((loginButton) => {
    var clickButton = loginButton.click();
    return clickButton;
})
.then(() => {
    console.log('Log in success.');
})
.catch((err) => {
    console.log(`Error ${err}.`);
})