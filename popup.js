// popup.js

document.addEventListener("DOMContentLoaded", function () {
  var addPageButton = document.getElementById("addPage");
  var checkPageButton = document.getElementById("checkPage");
  var clearRssButton = document.getElementById("clearRss");

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
    openPage("add.html");
  });

  checkPageButton.addEventListener("click", function () {
    openPage("check.html");
  });

  // Load saved feeds from storage and populate the UI
  loadSavedFeeds();
});

function openPage(pageName) {
  chrome.tabs.create({ url: pageName });
}

function loadSavedFeeds() {
  chrome.storage.sync.get(["rssFeeds"], function (result) {
    var rssFeeds = result.rssFeeds || [];
    console.log(rssFeeds);

    chrome.runtime.sendMessage({ action: "storedFeeds", data: rssFeeds });

    rssFeeds.forEach(function (rssURL) {
      console.log(rssURL);
      // fetchRssData(rssURL);
    });
  });
}
