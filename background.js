// background.js

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
  // console.log("refreshRssItems :", rssURL);
  // FETCH RSS FROM THE INPUT
  fetch(rssURL)
    .then((response) => response.text())
    .then((data) => {
      // var parser = new DOMParser();
      // var xmlDoc = parser.parseFromString(data, "text/xml");

      // GET THE LAST/NEW ITEM TITLE TO COMPARE IT
      // WITH THE OLD TITLE IN CHROME STORAGE
      // var rssItems = xmlDoc.getElementsByTagName("item");
      // var lastItemTitle = rssItems[0].querySelector("title").textContent;

      // console.log(data);

      const itemTitles = extractItemTitles(data);

      // Retrieve the last saved title from storage
      chrome.storage.sync.get(["savedTitle"], function (result) {
        var savedTitle = result.savedTitle;

        // console.log("savedTitle: ", savedTitle);
        // console.log("lastItemTitle: ", itemTitles[0]);

        // IF THE FIRST ITEM TITLE IS DIFFERENT FROM THE LAST SAVED TITLE
        // RUN FETCH THE ITEMS AGAIN AND RUN THE SOUND NOTIFICATION
        if (savedTitle !== itemTitles[0]) {
          // Update the saved title in storage
          chrome.storage.sync.set({ savedTitle: itemTitles[0] });
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

function extractItemTitles(xmlString) {
  // Use regular expressions to extract item titles inside <item> tags
  const itemTitleRegex = /<item[^>]*>(.*?)<\/item>/gs;
  const titleRegex = /<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/g;

  const matches = [];
  let itemMatch;

  // Find all <item> elements
  while ((itemMatch = itemTitleRegex.exec(xmlString)) !== null) {
    const itemContent = itemMatch[1];

    // Find <title> elements within each <item> element
    let titleMatch;
    while ((titleMatch = titleRegex.exec(itemContent)) !== null) {
      matches.push(titleMatch[1]);

      // console.log(matches);
    }
  }

  return matches;
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
  // chrome.sound.play("notification");

  // Show notification
  chrome.notifications.create(options);
}
