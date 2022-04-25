require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();

const LOGIN_URL = 'http://localhost:3000/login';
const REG_URL = 'http://localhost:3000/register';

var testsPassed = 0;

// test user credentials
var name = 'John Doe';
var email = 'tester2@psu.edu';

async function ts10() {
    // TC-10-001:  Mismatching Passwords Registration Attempt
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys(name);

    emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys(email);

    password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys('Testing11!');

    password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys('Testing22!');

    registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    await browserTab.switchTo().alert().accept();  // accept the alert notice

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === REG_URL) {
        console.log('[TC-10-001] (PASS): Mismatching passwords registration blocked.');  // Saturday, March 5, 7:01 PM
        testsPassed += 1;
    }
    else if (currentUrl === REG_URL) {
        console.log('[TC-10-001] (FAIL): Mismatching passwords registration allowed.');
        return;
    }
    else {
        console.log('[TC-10-001] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    // TC-10-002: No Captial Letter, Number, or Symbol Password Registration Attempt
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys(name);

    emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys(email);

    password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys('testerabc');

    password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys('testerabc');

    registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    await browserTab.switchTo().alert().accept();  // accept the alert notice

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === REG_URL) {
        console.log('[TC-10-002] (PASS): Unmet password credentials registration blocked.');
        testsPassed += 1;
    }
    else if (currentUrl === REG_URL) {
        console.log('[TC-10-002] (FAIL): Unmet password credentials registration allowed.');
        return;
    }
    else {
        console.log('[TC-10-002] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    // TC-10-003: Passwords Less Than 8 Characters Registration Attempt
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    var registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    var nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys(name);

    var emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys(email);

    var password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys('Abc1!');

    var password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys('Abc1!');

    var registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    await browserTab.switchTo().alert().accept();  // accept the alert notice

    var currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === REG_URL) {
        console.log('[TC-10-003] (PASS): Short password registration blocked.');
        testsPassed += 1;
    }
    else if (currentUrl === REG_URL) {
        console.log('[TC-10-003] (FAIL): Short password registration allowed.');
        return;
    }
    else {
        console.log('[TC-10-003] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    console.log(`[TS-10] (REPORT): ${testsPassed}/3 passed.`);
}

ts10();