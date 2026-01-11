// background.js v1.0.18

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('launcher.html'),
    active: true
  });
});
