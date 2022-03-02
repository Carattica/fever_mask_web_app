require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();
var browserTab = browser.forBrowser('chrome').build();

const LOGIN_URL = 'http://localhost:3000/login';
const VIO_URL = 'http://localhost:3000/violations_home'

var testsPassed = 0;

// test user credentials
var email = 'tester@psu.edu';
var password = 'Testing11!';
var unregisteredEmail = 'fake@psu.edu';  // TC-12-001
var emptyEmail = '';  // TC-12-002
var invalidPassword = '1testing1'  // TC-12-003

// TS-12
browserTab.get(LOGIN_URL).then(() => {
    var findTimeOutP = browserTab.manage().setTimeouts({
        implicit: 10000,  // set timeout to 10 seconds
    });
    return findTimeOutP;
})
.then(() => {  // TC-12-001
    var emailInput = browserTab.findElement(selenium.By.id('emailInput'));
    return emailInput;
})
.then((emailInput) => { emailInput.sendKeys(unregisteredEmail); })  // enter an invalid email 
.then(() => {
    var passwordInput = browserTab.findElement(selenium.By.id('passwordInput'));
    return passwordInput;
})
.then((passwordInput) => { passwordInput.sendKeys(password); })  // enter a valid password
.then(() => {
    var loginButton = browserTab.findElement(selenium.By.id('loginButton'));
    return loginButton;
})
.then((loginButton) => { loginButton.click(); })  // attempt login
.then(() => { return browserTab.getCurrentUrl(); })
.then((currentUrl) => {
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-12-001] (PASS): Unregistered email login blocked.');  // Wednesday, March 2, 9:56 AM
        testsPassed += 1;
    }
    else if (currentUrl === VIO_URL) {
        console.log('[TC-12-001] (FAIL): Unregistered email login allowed.');
        return;
    }
    else {
        console.log('[TC-12-001] (FAIL): Nothing resolved.');
        return;
    }
})
.then(() => {  // TC-12-002
    var emailInput = browserTab.findElement(selenium.By.id('emailInput'));
    return emailInput;
})
.then((emailInput) => {emailInput.sendKeys(emptyEmail); })  // enter an empty email
.then(() => {
    var passwordInput = browserTab.findElement(selenium.By.id('passwordInput'));
    return passwordInput;
})
.then((passwordInput) => { passwordInput.sendKeys(password); })  // enter a valid password
.then(() => {
    var loginButton = browserTab.findElement(selenium.By.id('loginButton'));
    return loginButton;
})
.then((loginButton) => { loginButton.click(); })  // attempt login
.then(() => { return browserTab.getCurrentUrl(); })
.then((currentUrl) => {
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-12-002] (PASS): Empty email login blocked.');  // Wednesday, March 2, 10:01 AM
        testsPassed += 1;
    }
    else if (currentUrl === VIO_URL) {
        console.log('[TC-12-002] (FAIL): Empty email login allowed.');
        return;
    }
    else {
        console.log('[TC-12-002] (FAIL): Nothing resolved.');
        return;
    }
})
.then(() => {  // TC-12-003
    var emailInput = browserTab.findElement(selenium.By.id('emailInput'));
    return emailInput;
})
.then((emailInput) => { emailInput.sendKeys(email); })  // enter a valid email
.then(() => {
    var passwordInput = browserTab.findElement(selenium.By.id('passwordInput'));
    return passwordInput;
})
.then((passwordInput) => { passwordInput.sendKeys(invalidPassword); })  // enter an incorrect password
.then(() => {
    var loginButton = browserTab.findElement(selenium.By.id('loginButton'));
    return loginButton;
})
.then((loginButton) => { loginButton.click(); })  // attempt login
.then(() => { return browserTab.getCurrentUrl(); })
.then((currentUrl) => {
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-12-003] (PASS): Invalid password login blocked.');  // Wednesday, March 2, 10:07 AM
        testsPassed += 1;
    }
    else if (currentUrl === VIO_URL) {
        console.log('[TC-12-003] (FAIL): Invalid password login allowed.');
        return;
    }
    else {
        console.log('[TC-12-003] (FAIL): Nothing resolved.');
        return;
    }
})
.then(() => {
    console.log(`[TS-12] (REPORT): ${testsPassed}/3 passed.`)
    browserTab.close();
});