// background.js

document.addEventListener("DOMContentLoaded", function () {
  loadSavedFeeds();
});

function loadSavedFeeds() {
  chrome.storage.sync.get(["rssFeeds"], function (result) {
    var rssFeeds = result.rssFeeds || [];
    console.log("loaded feed f ga3 les page: ", rssFeeds);

    // chrome.runtime.sendMessage({ action: "storedFeeds", data: rssFeeds });

    var storedRssFeeds = document.getElementById("storedRss");

    if (storedRssFeeds) {
      storedRssFeeds.innerHTML = "";

      for (let index = 0; index < rssFeeds.length; index++) {
        const feed = rssFeeds[index];

        // Create a new link element
        var linkElement = document.createElement("a");
        linkElement.href = "#"; // Set href to "#" to prevent page reload
        linkElement.classList.add("feedURL");
        linkElement.innerText = `Feed ${index}`;

        // Add a click event listener to the link
        linkElement.addEventListener("click", function () {
          chrome.runtime.sendMessage({
            action: "selectedFeedItem",
            data: feed,
          });
        });

        // Create a new paragraph element and append the link to it
        var paragraphElement = document.createElement("p");
        paragraphElement.appendChild(linkElement);

        // Append the paragraph element to the container
        storedRssFeeds.appendChild(paragraphElement);
      }
    } else {
      console.warn("Element with id 'storedRss' not found.");
    }
  });
}

// Use chrome.alarms to schedule periodic tasks instead of setInterval
chrome.alarms.create("updateAlarm", {
  periodInMinutes: 0.5, // Adjust the interval as needed
});

// Add an event listener for the alarm
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "updateAlarm") {
    // console.log("hello");
    chrome.tabs.query({}, function (tabs) {
      // Send the message to all tabs
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, { action: "refreshRssItems" });
      });
    });
  }
});
