import resemble from 'resemblejs';

resemble.outputSettings({
  errorColor: {red: 255, green: 0, blue: 0},
  transparency: 1.0,
  scaleToSameSize: true
});

const SCREENSHOT_INTERVAL = 1000;
const CHROME_PROTOCOLS = ['chrome', 'devtools'];

var current_tab = -1;
var images = {};
var interval; 

chrome.tabs.onActivated.addListener(activeInfo => handleOnActivated(activeInfo));
chrome.tabs.onUpdated.addListener((tabId, info) => handleOnUpdated(tabId, info));

function startScreenShot() {
  interval = setInterval(takeScreenshot, SCREENSHOT_INTERVAL);
}

function stopScreenShot() {
  current_tab = -1;
  clearInterval(interval);
  sleep(SCREENSHOT_INTERVAL);
}

function takeScreenshot() {
  chrome.tabs.getSelected(null, function(tab) {
    const protocol = tab.url.split('://')[0];
    if (CHROME_PROTOCOLS.includes(protocol)) return;

    chrome.tabs.captureVisibleTab(null, {}, function (image) { 
      if (current_tab === -1) return;
      images[current_tab] = image;
      console.log(`screenshot taken of tab ${current_tab}`);
    });
  });
}

function handleOnActivated(activeInfo) {
  stopScreenShot(); 
  console.log('handleOnActivated: service stopped');

  chrome.tabs.getSelected(null, function(tab) {
    function leave() {
      current_tab = activeInfo.tabId;
      startScreenShot();
      console.log('handleOnActivated: service started');
    }

    const protocol = tab.url.split('://')[0];
    if (CHROME_PROTOCOLS.includes(protocol)) {
      leave();
      return;
    }

    sleep(500).then(() => {
      chrome.tabs.captureVisibleTab(null, {}, function (image) { 
        const file1 = images[activeInfo.tabId];
        const file2 = image;

        chrome.tabs.executeScript(activeInfo.tabId, {
          code: `
          var a = document.createElement("a");
          a.href = "${file1}";
          a.setAttribute("download", "file1.jpeg");
          a.click();
          `
        });
        chrome.tabs.executeScript(activeInfo.tabId, {
          code: `
          var a = document.createElement("a");
          a.href = "${file2}";
          a.setAttribute("download", "file2.jpeg");
          a.click();
          `
        });

        if (file1 === undefined) {
          leave();
          return;
        }

        resemble(file1).compareTo(file2).onComplete(data => {
          console.log(`mismatch percentage: ${data.misMatchPercentage}%`);
          console.log(data);

          let diffImage = data.getImageDataUrl();

          if (data.misMatchPercentage > 0) {
            chrome.tabs.executeScript(activeInfo.tabId, {
              code: `
              var a = document.createElement("a");
              a.href = "${diffImage}";
              a.setAttribute("download", "download.jpeg");
              a.click();
              `
            });
          }
          leave();
        });
      });
    });
  });
}

function handleOnUpdated(tabId, info) {
  if (info.status === 'complete') {
    current_tab = tabId;
    takeScreenshot();
  } 
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}