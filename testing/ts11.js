require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();
var browserTab = browser.forBrowser('chrome').build();

const LOGIN_URL = 'http://localhost:3000/login';
const REG_URL = 'http://localhost:3000/register';

var testsPassed = 0;

// test user credentials
var email = 'tester2@psu.edu';
var password = 'Testing11!';

async function ts11() {
    // TC-11-001: Empty Name Registration Attempt
    await browserTab.get(LOGIN_URL);

    var registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    var nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys('');

    var emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys(email);

    var password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys(password);

    var password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys(password);

    var registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    var currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === REG_URL) {
        console.log('[TC-11-001] (PASS): Empty name registration blocked.');
        testsPassed += 1;
    }
    else if (currentUrl === REG_URL) {
        console.log('[TC-11-001] (FAIL): Empty name registration allowed.');
        return;
    }
    else {
        console.log('[TC-11-001] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    // TC-11-002: Successful Registration Attempt
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    var registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    var nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys('Tester 2');

    var emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys(email);

    var password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys(password);

    var password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys(password);

    var registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    var currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-11-002] (PASS): Valid registration allowed.');
        testsPassed += 1;
    }
    else if (currentUrl === REG_URL) {
        console.log('[TC-11-002] (FAIL): Valid registration not allowed.');
        return;
    }
    else {
        console.log('[TC-11-002] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    console.log(`[TS-11] (REPORT): ${testsPassed}/2 passed.`);
}

ts11();