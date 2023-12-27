// popup.js

document.addEventListener("DOMContentLoaded", function () {
  var addPageButton = document.getElementById("addPage");
  var checkPageButton = document.getElementById("checkPage");
  var clearRssButton = document.getElementById("clearRss");

  sendMessageToIndex("showPopup");

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
    sendMessageToIndex("showAdd");
  });

  checkPageButton.addEventListener("click", function () {
    sendMessageToIndex("showCheck");
  });
});

function sendMessageToIndex(action) {
  // Send a message to index.html with the selected action
  chrome.runtime.sendMessage({ action: action });
}

function openPage(pageName) {
  chrome.tabs.create({ url: pageName });
}
