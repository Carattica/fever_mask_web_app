require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();
var browserTab = browser.forBrowser('chrome').build();

const LOGIN_URL = 'http://localhost:3000/login';
const REG_URL = 'http://localhost:3000/register';

var testsPassed = 0;

// test user credentials
var name = 'John Doe';
var password = 'Testing11!';

async function ts09() {
    // TC-09-001: Two @ Sign Email Registration Attempt
    await browserTab.get(LOGIN_URL);

    var registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    var nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys(name);

    var emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys('f@ake@psu.edu');

    var password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys(password);

    var password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys(password);

    var registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    await browserTab.switchTo().alert().accept();  // accept the alert notice

    var currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === REG_URL) {
        console.log('[TC-09-001] (PASS): Two @ sign email registration blocked.');  // Saturday, March 5, 2:14 PM
        testsPassed += 1;
    }
    else if (currentUrl === REG_URL) {
        console.log('[TC-09-001] (FAIL): Two @ sign email registration allowed.');
        return;
    }
    else {
        console.log('[TC-09-001] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    // TC-09-002: Non-PSU Domain Email Registration Attempt
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys(name);

    emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys('fake@gmail.com');

    password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys(password);

    password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys(password);

    registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    await browserTab.switchTo().alert().accept();  // accept the alert notice

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === REG_URL) {
        console.log('[TC-09-002] (PASS): Non-PSU domain email registration blocked.');  // Saturday, March 5, 2:20 PM
        testsPassed += 1;
    }
    else if (currentUrl === REG_URL) {
        console.log('[TC-09-002] (FAIL): Non-PSU domain email registration allowed.');
        return;
    }
    else {
        console.log('[TC-09-002] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    // TC-09-003: Already Registered Email Registration Attempt
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys(name);

    emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys('tester@psu.edu');

    password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys(password);

    password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys(password);

    registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    await browserTab.switchTo().alert().accept();  // accept the alert notice

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === REG_URL) {
        console.log('[TC-09-003] (PASS): Already registered email registration blocked.');  // Saturday, March 5, 2:31 PM
        testsPassed += 1;
    }
    else if (currentUrl === REG_URL) {
        console.log('[TC-09-003] (FAIL): Already registered email registration allowed.');
        return;
    }
    else {
        console.log('[TC-09-003] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    // TC-09-004: Empty Email Registration Attempt
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    registerLink = await browserTab.findElement(selenium.By.linkText('Create Account'));
    await registerLink.click();

    nameInput = await browserTab.findElement(selenium.By.id('nameInput'));
    await nameInput.sendKeys(name);

    emailInput = await browserTab.findElement(selenium.By.id('emailInput'));
    await emailInput.sendKeys('');

    password1Input = await browserTab.findElement(selenium.By.id('password1Input'));
    await password1Input.sendKeys(password);

    password2Input = await browserTab.findElement(selenium.By.id('password2Input'));
    await password2Input.sendKeys(password);

    registerButton = await browserTab.findElement(selenium.By.id('registerButton'));
    await registerButton.click();

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === REG_URL) {
        console.log('[TC-09-004] (PASS): Empty email registration blocked.');  // Saturday, March 5, 2:33 PM
        testsPassed += 1;
    }
    else if (currentUrl === REG_URL) {
        console.log('[TC-09-004] (FAIL): Empty email registration allowed.');
        return;
    }
    else {
        console.log('[TC-09-004] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    console.log(`[TS-09] (REPORT): ${testsPassed}/4 passed.`);
}

ts09();