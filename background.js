// background.js

document.addEventListener("DOMContentLoaded", function () {
  // loadSavedFeeds();
  // storeClickedFeed();
});

// Use chrome.alarms to schedule periodic tasks instead of setInterval
chrome.alarms.create("updateAlarm", {
  periodInMinutes: 0.5, // Adjust the interval as needed
});

// Add an event listener for the alarm
chrome.alarms.onAlarm.addListener(function (alarm) {
  // console.log("update");
  if (alarm.name === "updateAlarm") {
    chrome.storage.sync.get(["selectedRssURL"], function (result) {
      var selectedRssURL = result.selectedRssURL;
      selectedRssURL && refreshRssItems(selectedRssURL);
    });
    // chrome.runtime.sendMessage({ action: "refreshRssItems" });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "showNotification") {
    showNotification("Rss Feed Updated", "Check for new feeds!");
  }
});

function refreshRssItems(rssURL) {
  console.log("refreshRssItems :", rssURL);
  // FETCH RSS FROM THE INPUT
  fetch(rssURL)
    .then((response) => response.text())
    .then((data) => {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(data, "text/xml");

      // GET THE LAST/NEW ITEM TITLE TO COMPARE IT
      // WITH THE OLD TITLE IN CHROME STORAGE
      var rssItems = xmlDoc.getElementsByTagName("item");
      var lastItemTitle = rssItems[0].querySelector("title").textContent;

      // Retrieve the last saved title from storage
      chrome.storage.sync.get(["savedTitle"], function (result) {
        var savedTitle = result.savedTitle;

        console.log("savedTitle: ", savedTitle);
        console.log("lastItemTitle: ", lastItemTitle);

        // IF THE FIRST ITEM TITLE IS DIFFERENT FROM THE LAST SAVED TITLE
        // RUN FETCH THE ITEMS AGAIN AND RUN THE SOUND NOTIFICATION
        if (savedTitle !== lastItemTitle) {
          // Update the saved title in storage
          chrome.storage.sync.set({ savedTitle: lastItemTitle });
          // chrome.runtime.sendMessage({ action: "updateItems" });
          // Show the notification only once for new data
          // chrome.runtime.sendMessage({ action: "showNotification" });
          showNotification(
            "New Feed Added!",
            "Check for new feeds on your chrome extension!"
          );
        }
      });
    });
}

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
