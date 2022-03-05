require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();
var browserTab = browser.forBrowser('chrome').build();
var browserTab2 = browser.forBrowser('chrome').build();
var browserTab3 = browser.forBrowser('chrome').build();

const LOGIN_URL = 'http://localhost:3000/login';
const VIO_URL = 'http://localhost:3000/violations_home';

var testsPassed = 0;

// test user credentials
var email = 'tester@psu.edu';
var password = 'Testing11!';
var unregisteredEmail = 'fake@psu.edu';  // TC-12-001
var emptyEmail = '';  // TC-12-002
var invalidPassword = '1testing1';  // TC-12-003

async function ts12() {
    // TS-12-001: Unregistered Email Login Attempt
    await browserTab.get(LOGIN_URL);

    const emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys(unregisteredEmail);

    const passwordInput = await browserTab.findElement(selenium.By.id('passwordInput'));
    await passwordInput.sendKeys(password);

    const loginButton = await browserTab.findElement(selenium.By.id('loginButton'));
    await loginButton.click();

    const currentUrl = await browserTab.getCurrentUrl();
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

    await browserTab.close();

    // TS-12-002: Empty Email Login Attempt
    await browserTab2.get(LOGIN_URL);

    const emailInput2 = await browserTab2.findElement(selenium.By.id('emailInput'));
    await emailInput2.sendKeys(emptyEmail);

    const passwordInput2 = await browserTab2.findElement(selenium.By.id('passwordInput'));
    await passwordInput2.sendKeys(password);

    loginButton2 = await browserTab2.findElement(selenium.By.id('loginButton'));
    await loginButton2.click();

    const currentUrl2 = await browserTab2.getCurrentUrl();
    if (currentUrl2 === LOGIN_URL) {
        console.log('[TC-12-002] (PASS): Empty email login blocked.');  // Wednesday, March 2, 9:56 AM
        testsPassed += 1;
    }
    else if (currentUrl2 === VIO_URL) {
        console.log('[TC-12-002] (FAIL): Empty email login allowed.');
        return;
    }
    else {
        console.log('[TC-12-002] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab2.close();

    // TS-12-003: Invalid Password Login Attempt
    await browserTab3.get(LOGIN_URL);

    const emailInput3 = await browserTab3.findElement(selenium.By.id('emailInput'));
    await emailInput3.sendKeys(email);

    const passwordInput3 = await browserTab3.findElement(selenium.By.id('passwordInput'));
    await passwordInput3.sendKeys(invalidPassword);

    const loginButton3 = await browserTab3.findElement(selenium.By.id('loginButton'));
    await loginButton3.click();

    const currentUrl3 = await browserTab3.getCurrentUrl();
    if (currentUrl3 === LOGIN_URL) {
        console.log('[TC-12-003] (PASS): Invalid password login blocked.');  // Wednesday, March 2, 9:56 AM
        testsPassed += 1;
    }
    else if (currentUrl3 === VIO_URL) {
        console.log('[TC-12-003] (FAIL): Invalid password login allowed.');
        return;
    }
    else {
        console.log('[TC-12-003] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab3.close();

    console.log(`[TS-12] (REPORT): ${testsPassed}/3 passed.`);
}

ts12();