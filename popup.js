document.addEventListener("DOMContentLoaded", function () {
  var addPageButton = document.getElementById("addPage");
  var checkPageButton = document.getElementById("checkPage");
  var clearRssButton = document.getElementById("clearRss");

  sendMessageToBackground("showPopup");

  clearRssButton.addEventListener("click", function () {
    // Clear all data stored in chrome.storage.sync
    chrome.storage.sync.clear(function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log("Storage cleared successfully");
      }
    });
  });

  addPageButton.addEventListener("click", function () {
    sendMessageToBackground("showAdd");
  });

  checkPageButton.addEventListener("click", function () {
    sendMessageToBackground("showCheck");
  });
});

function sendMessageToBackground(action) {
  // Send a message to the background script with the selected action
  chrome.runtime.sendMessage({ action: action });
}

function openPage(pageName) {
  // Open a new tab with the specified URL
  chrome.tabs.create({ url: pageName });
}
