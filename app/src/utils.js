import { detect } from "detect-browser";

const browser = detect();

function getIsMobileOS() {
  const { os } = browser;
  if (!os) {
    return false;
  }

  const mobileOSes = ["iOS", "Android OS", "BlackBerry OS", "Windows Mobile"];
  if (mobileOSes.includes(os)) {
    return true;
  }

  return false;
}

function getIsGoodBrowser() {
  const goodBrowsers = ["chrome", "safari"];

  if (goodBrowsers.includes(browser.name) || getIsMobileOS()) {
    return true;
  }

  return false;
}

export { getIsMobileOS, getIsGoodBrowser };
