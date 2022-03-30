require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();
var browserTab = browser.forBrowser('chrome').build();

const LOGIN_URL = 'http://localhost:3000/login';
const REG_URL = 'http://localhost:3000/register';
const VIO_URL = 'http://localhost:3000/violations_home';

var testsPassed = 0;

// test user credentials
var email = 'tester@psu.edu';
var password = 'Testing11!';

async function ts12() {
    // TC-12-001: Unregistered Email Login Attempt
    await browserTab.get(LOGIN_URL);

    var emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys('fake@psu.edu');

    var passwordInput = await browserTab.findElement(selenium.By.id('passwordInput'));
    await passwordInput.sendKeys(password);

    var loginButton = await browserTab.findElement(selenium.By.id('loginButton'));
    await loginButton.click();

    var currentUrl = await browserTab.getCurrentUrl();
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

    // TC-12-002: Empty Email Login Attempt
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys('');

    passwordInput = await browserTab.findElement(selenium.By.id('passwordInput'));
    await passwordInput.sendKeys(password);

    loginButton = await browserTab.findElement(selenium.By.id('loginButton'));
    await loginButton.click();

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-12-002] (PASS): Empty email login blocked.');  // Wednesday, March 2, 9:56 AM
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

    await browserTab.close();

    // TC-12-003: Invalid Password Login Attempt
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys(email);

    passwordInput = await browserTab.findElement(selenium.By.id('passwordInput'));
    await passwordInput.sendKeys('1testing1');

    loginButton = await browserTab.findElement(selenium.By.id('loginButton'));
    await loginButton.click();

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-12-003] (PASS): Invalid password login blocked.');  // Wednesday, March 2, 9:56 AM
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

    await browserTab.close();

    // TC-12-004: Undetermined Role Login Attempt 
    // registration step
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys('Abc');

    emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys('abc@psu.edu');

    password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys('Testing11!');

    password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys('Testing11!');

    var registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    // login step
    emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys('abc@psu.edu');

    passwordInput = await browserTab.findElement(selenium.By.id('passwordInput'));
    await passwordInput.sendKeys('Testing11!');

    loginButton = await browserTab.findElement(selenium.By.id('loginButton'));
    await loginButton.click();

    await browserTab.switchTo().alert().accept();  // accept the alert notice

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-12-004] (PASS): Undetermined role login blocked.');  // Wednesday, March 2, 9:56 AM
        testsPassed += 1;
    }
    else if (currentUrl === VIO_URL) {
        console.log('[TC-12-004] (FAIL): Undetermined role login allowed.');
        return;
    }
    else {
        console.log('[TC-12-004] (FAIL): Nothing resolved.');
        return;
    }

    console.log(`[TS-12] (REPORT): ${testsPassed}/4 passed.`);

    await browserTab.close();
}

ts12();