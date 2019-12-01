import resemble from 'resemblejs';

resemble.outputSettings({
  errorColor: {red: 255, green: 0, blue: 0},
  transparency: 0,
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

    chrome.tabs.captureVisibleTab(null, {"format":"png"}, function (image) { 
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

    sleep(50).then(() => {
      chrome.tabs.captureVisibleTab(null, {"format":"png"}, function (image) { 
        const file1 = images[activeInfo.tabId];
        const file2 = image;

        if (file1 === undefined) {
          leave();
          return;
        }

        resemble(file1).compareTo(file2).onComplete(data => {
          console.log(`mismatch percentage: ${data.misMatchPercentage}%`);
          console.log(data);

          if (data.misMatchPercentage > 10) {
            chrome.tabs.executeScript({
              code: `
                var div = document.createElement('div');
                div.setAttribute('id', 'tabnab');
                div.setAttribute('style', 'position: fixed; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000;');
    
                var img = document.createElement('img'); 
                img.src = '${data.getImageDataUrl()}'; 
  
                div.appendChild(img);
  
                document.body.appendChild(div);
              `
            });  

            if(confirm('TABNABBING DETECTED!\nDo you want to report this website?')) {
              console.log('url sent to blacklist');
              //TODO send to blacklist
            } 
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