// background.js v1.0.19

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('launcher.html'),
    active: true
  });
});
