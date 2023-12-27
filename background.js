// background.js

document.addEventListener("DOMContentLoaded", function () {
  loadSavedFeeds();
  storeClickedFeed();
});

function storeClickedFeed() {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "selectedFeedItem") {
      var selectedRssURL = request.data;

      chrome.storage.sync.set({ selectedRssURL: selectedRssURL });
    }
  });
}

function loadSavedFeeds() {
  chrome.storage.sync.get(["rssFeeds"], function (result) {
    var rssFeeds = result.rssFeeds || [];

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
  console.log("update");
  if (alarm.name === "updateAlarm") {
    chrome.runtime.sendMessage({ action: "refreshRssItems" });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "showNotification") {
    showNotification("Rss Feed Updated", "Check for new feeds!");
  }
});

function showNotification(title, message) {
  // Notification options
  const options = {
    type: "basic",
    iconUrl: "icon.png",
    title: title,
    message: message,
  };

  // Play a notification sound (you can replace 'sound.mp3' with your sound file)
  const audio = new Audio("sound.mp3");
  audio.play();

  // Show notification
  chrome.notifications.create(options);
}
