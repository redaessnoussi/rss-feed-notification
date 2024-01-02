// add.js
document.addEventListener("DOMContentLoaded", function () {
  var readRSSButton = document.getElementById("addFeed");
  var rssURL = document.getElementsByClassName("feedURL")
  readRSSButton.addEventListener("click", function () {
    addRssURL();
  });
});

function addRssURL() {
  var rssNameInput = document.getElementById("rssName");
  var rssName = rssNameInput.value.trim();

  var rssUrlInput = document.getElementById("rssUrl");
  var rssURL = rssUrlInput.value.trim();

  // Fetch and display the new RSS feed
  // Save the new feed URL to storage
  chrome.storage.sync.get(["rssFeeds"], function (result) {
    var rssFeeds = result.rssFeeds || [];
    rssFeeds.push({rssURL, rssName});
    chrome.storage.sync.set({ rssFeeds: rssFeeds });
  });
  
  // Notify the background script about the new feed URL
  chrome.runtime.sendMessage({ action: "newFeedAdded", data: {rssURL, rssName} });

  // Dynamically update the UI to show the newly added feed
  updateUIWithNewFeeds(rssName, rssURL);
}

// Getting the added RSS Feeds URL's as an array
// Function to handle messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "storedFeeds") {
    var storedFeeds = request.data;

    var storedRssFeeds = document.getElementById("storedRss");
    storedRssFeeds.innerHTML = "";

    for (let index = 0; index < storedFeeds.length; index++) {
      const feed = storedFeeds[index];

      console.log(feed)

      // Create a new link element
      var linkElement = document.createElement("a");
      linkElement.href = "#"; // Set href to "#" to prevent page reload
      linkElement.classList.add("feedURL");
      linkElement.innerText = `${rssName} ${index}`;

      // Add a click event listener to the link
      linkElement.addEventListener("click", function () {
        chrome.runtime.sendMessage({ action: "selectedFeedItem", data: feed });
      });

      // Create a new paragraph element and append the link to it
      var paragraphElement = document.createElement("p");
      paragraphElement.appendChild(linkElement);

      // Append the paragraph element to the container
      storedRssFeeds.appendChild(paragraphElement);
    }
  }
});

// Function to dynamically update the UI with the newly added feed
function updateUIWithNewFeeds(rssName, rssURL) {
  // Get the container for stored feeds
  var storedRssFeeds = document.getElementById("storedRss");

  // Create a new link element for the added feed
  var linkElement = document.createElement("a");
  linkElement.href = "#"; // Set href to "#" to prevent page reload
  linkElement.classList.add("feedURL");
  linkElement.innerText = `${rssName}`;

  // Add a click event listener to the link
  linkElement.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "selectedFeedItem", data: {rssName, rssURL} });
  });

  // Create a new paragraph element and append the link to it
  var paragraphElement = document.createElement("p");
  paragraphElement.appendChild(linkElement);

  // Append the paragraph element to the container
  storedRssFeeds.appendChild(paragraphElement);
}
