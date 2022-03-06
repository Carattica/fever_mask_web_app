require('chromedriver');  // using chrome for automated tests

var selenium = require('selenium-webdriver');
var browser = new selenium.Builder();

const LOGIN_URL = 'http://localhost:3000/login';
const VIOH_URL = 'http://localhost:3000/violations_home';
const VIOW_URL = 'http://localhost:3000/violations_weekly';
const CTRL_URL = 'http://localhost:3000/control_access';

var testsPassed = 0;

async function ts13() {
    // TC-13-001: Restrict access to violations_home
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    await browserTab.get(VIOH_URL);

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-13-001] (PASS): Unauthorized violations_home access blocked.');  // Saturday, March 5, 7:23 PM
        testsPassed += 1;
    }
    else if (currentUrl === LOGIN_URL) {
        console.log('[TC-13-001] (FAIL): Unauthorized violations_home access allowed.');
        return;
    }
    else {
        console.log('[TC-13-001] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    // TC-13-002: Restrict access to violations_weekly
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    await browserTab.get(VIOW_URL);

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-13-002] (PASS): Unauthorized violations_weekly access blocked.');  // Saturday, March 5, 7:23 PM
        testsPassed += 1;
    }
    else if (currentUrl === LOGIN_URL) {
        console.log('[TC-13-002] (FAIL): Unauthorized violations_weekly access allowed.');
        return;
    }
    else {
        console.log('[TC-13-002] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    // TC-13-003: Restrict access to control_access
    browserTab = await browser.forBrowser('chrome').build();
    await browserTab.get(LOGIN_URL);

    await browserTab.get(CTRL_URL);

    currentUrl = await browserTab.getCurrentUrl();
    if (currentUrl === LOGIN_URL) {
        console.log('[TC-13-003] (PASS): Unauthorized control_access access blocked.');  // Saturday, March 5, 7:23 PM
        testsPassed += 1;
    }
    else if (currentUrl === LOGIN_URL) {
        console.log('[TC-13-003] (FAIL): Unauthorized control_access access allowed.');
        return;
    }
    else {
        console.log('[TC-13-003] (FAIL): Nothing resolved.');
        return;
    }

    await browserTab.close();

    console.log(`[TS-13] (REPORT): ${testsPassed}/3 passed.`);
}

ts13();