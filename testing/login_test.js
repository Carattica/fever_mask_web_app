require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();
var browserTab = browser.forBrowser('chrome').build();

const URL = 'http://localhost:3000/login';

// test user credentials
var unregisteredEmail = 'fake@psu.edu';
var password = 'Testing11!';

browserTab.get(URL).then(() => {
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
    var fillEmail = emailInput.sendKeys(unregisteredEmail);
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
    return browserTab.getCurrentUrl();
})
.then((currentUrl) => {
    if (currentUrl === URL) {
        console.log('TEST PASS: Invalid login blocked.');
    }
    else if (currentUrl === 'http://localhost:3000/violations_home') {
        console.log('TEST FAIL: Invalid login allowed.');
    }
    else {
        console.log('TEST FAIL: Nothing resolved.');
    }
});