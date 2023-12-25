// content.js

var selectedItem;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "selectedFeedItem") {
    selectedItem = request.data;
    // console.log("selected item is ", selectedItem);
  }

  if (request.action === "refreshRssItems") {
    // Check if selectedItem is defined before calling refreshRssItems
    if (selectedItem) {
      refreshRssItems(selectedItem);
    } else {
      console.error("selectedItem is not defined.");
    }
  }
});

function refreshRssItems(rssURL) {
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

        // console.log("Old Title : ", savedTitle);
        // console.log("New Title : ", lastItemTitle);

        // IF THE FIRST ITEM TITLE IS DIFFERENT FROM THE LAST SAVED TITLE
        // RUN FETCH THE ITEMS AGAIN AND RUN THE SOUND NOTIFICATION
        if (savedTitle !== lastItemTitle) {
          // console.log("RSS updated");
          showItems(xmlDoc);

          // Update the saved title in storage
          chrome.storage.sync.set({ savedTitle: lastItemTitle });

          // Show the notification only once for new data
          showNotification("Rss Feed Updated", "Check for new feeds!");
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
