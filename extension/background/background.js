// NOTE: run `npm run build` in the root directory of extension/ to do a webpack build b/c we are using node_modules

import resemble from 'resemblejs'
const SCREENSHOT_INTERVAL = 500; // how many milliseconds for each screenshot

var currentTabId = "INIT_ID";
var images = {} // e.g.. { tabId : image dataurl, tabId2: imagedataurl }
var pauseScreenshots = false

function takeScreenshot() {
  if (!pauseScreenshots) {
    let beforeTabId = currentTabId // fix timing issue when taking screenshots between tab transition
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
      if (pauseScreenshots || (beforeTabId != currentTabId))
        return
      images[currentTabId] = image;
    })
  }
}

// 1. While a user is browsing a webpage, take screenshots on regular intervals, always keeping the last one.
setInterval(takeScreenshot, SCREENSHOT_INTERVAL)

// 2. Detect the change to a new tab (loss of focus).
chrome.tabs.onActivated.addListener(function (activeInfo) {
  pauseScreenshots = true // pause screenshotting as we transition between tabs
  let tabId = activeInfo.tabId
  currentTabId = tabId

  if (!images[tabId]) { // Don't do anything if new tab
    pauseScreenshots = false
    return
  }
  // 3. When a user returns to the tab, take a fresh screenshot and compare the two.

  chrome.tabs.captureVisibleTab(null, {}, function (image) {
    resemble(image).compareTo(images[tabId]).onComplete(data => {
      let diffImage = data.getImageDataUrl()
      console.log(data.misMatchPercentage)
      if (data.misMatchPercentage > 10)
        chrome.tabs.executeScript(tabId, {
          code: `
          var a = document.createElement("a");
          a.href = "${diffImage}";
          a.setAttribute("download", "download.jpeg");
          a.click();
          `
        })

      pauseScreenshots = false
    })
    // takeScreenShotInterval = setInterval(takeScreenshot, SCREENSHOT_INTERVAL)
  })

  // takeScreenshotInterval = setInterval(takeScreenshot, SCREENSHOT_INTERVAL)
})