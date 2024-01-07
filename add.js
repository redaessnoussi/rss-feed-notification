document.addEventListener("DOMContentLoaded", function () {
  var readRSSButton = document.getElementById("addFeed");
  var rssURLInput = document.getElementById("rssUrl");
  readRSSButton.addEventListener("click", function () {
    addRssURL();
  });

  loadSavedFeeds();
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
    rssFeeds.push({ rssURL, rssName });
    chrome.storage.sync.set({ rssFeeds: rssFeeds });
  });

  // Notify the background script about the new feed URL
  chrome.runtime.sendMessage({
    action: "newFeedAdded",
    data: { rssURL, rssName },
  });

  // Dynamically update the UI to show the newly added feed
  updateUIWithNewFeeds(rssName, rssURL);
}

// Getting the added RSS Feeds URL's as an array
// Function to handle messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "storedFeeds") {
    var storedFeeds = request.data;

    var storedRssFeeds = document.getElementById("storedRss");
    if (storedRssFeeds) {
      storedRssFeeds.innerHTML = `<table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Added RSS</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>`;

      for (let index = 0; index < storedFeeds.length; index++) {
        const feed = storedFeeds[index];

        var trElement = document.createElement("tr");
        var thElement = document.createElement("th");
        thElement.setAttribute("scope", "row");
        thElement.textContent = index;

        // Append th element to tr element
        trElement.appendChild(thElement);

        // Create the td element with the link
        var tdElement = document.createElement("td");
        var aElement = document.createElement("a");
        aElement.setAttribute("href", "#");
        aElement.setAttribute("class", "feedURL");
        aElement.textContent = `${feed.rssName}`;

        // Add a click event listener to the link
        aElement.addEventListener("click", function () {
          chrome.runtime.sendMessage({
            action: "selectedFeedItem",
            data: feed,
          });
          console.log("storeClickedFeed: ", feed.rssURL);
          storeClickedFeed(feed.rssURL);
        });

        // Append a element to td element
        tdElement.appendChild(aElement);

        // Append td element to tr element
        trElement.appendChild(tdElement);

        var tbodyElement = storedRssFeeds.querySelector(".table tbody");
        tbodyElement.appendChild(trElement);
      }
    } else {
      console.warn("Element with id 'storedRss' not found.");
    }
  }
});

// Function to dynamically update the UI with the newly added feed
function updateUIWithNewFeeds(rssName, rssURL) {
  // Get the container for stored feeds
  var storedRssFeeds = document.getElementById("storedRss");

  if (storedRssFeeds) {
    var trElement = document.createElement("tr");
    var thElement = document.createElement("th");
    thElement.setAttribute("scope", "row");
    thElement.textContent = "New";

    // Append th element to tr element
    trElement.appendChild(thElement);

    // Create the td element with the link
    var tdElement = document.createElement("td");
    var aElement = document.createElement("a");
    aElement.setAttribute("href", "#");
    aElement.setAttribute("class", "feedURL");
    aElement.textContent = `${rssName}`;

    // Add a click event listener to the link
    aElement.addEventListener("click", function () {
      chrome.runtime.sendMessage({
        action: "selectedFeedItem",
        data: { rssName, rssURL },
      });
      console.log("storeClickedFeed: ", rssURL);
      storeClickedFeed(rssURL);
    });

    // Append a element to td element
    tdElement.appendChild(aElement);

    // Append td element to tr element
    trElement.appendChild(tdElement);

    var tbodyElement = storedRssFeeds.querySelector(".table tbody");
    tbodyElement.appendChild(trElement);
  } else {
    console.warn("Element with id 'storedRss' not found.");
  }
}

function storeClickedFeed(selectedRss) {
  console.log("selectedRss :", selectedRss);
  // Send "showCheck" message to index.html with the selected action
  chrome.storage.sync.set({ selectedRssURL: selectedRss });
  chrome.runtime.sendMessage({ action: "showCheck" });
}

function loadSavedFeeds() {
  chrome.storage.sync.get(["rssFeeds"], function (result) {
    var rssFeeds = result.rssFeeds || [];

    console.log(rssFeeds);

    var storedRssFeeds = document.getElementById("storedRss");

    if (storedRssFeeds) {
      storedRssFeeds.innerHTML = `<table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Added RSS</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>`;

      for (let index = 0; index < rssFeeds.length; index++) {
        const feed = rssFeeds[index];

        var trElement = document.createElement("tr");
        var thElement = document.createElement("th");
        thElement.setAttribute("scope", "row");
        thElement.textContent = index;

        // Append th element to tr element
        trElement.appendChild(thElement);

        // Create the td element with the link
        var tdElement = document.createElement("td");
        var aElement = document.createElement("a");
        aElement.setAttribute("href", "#");
        aElement.setAttribute("class", "feedURL");
        aElement.textContent = `${feed.rssName}`;

        // Add a click event listener to the link
        aElement.addEventListener("click", function () {
          storeClickedFeed(feed.rssURL);
          console.log("storeClickedFeed :", feed.rssURL);
          chrome.runtime.sendMessage({
            action: "selectedFeedItem",
            data: feed,
          });
        });

        // Append a element to td element
        tdElement.appendChild(aElement);

        // Append td element to tr element
        trElement.appendChild(tdElement);

        var tbodyElement = storedRssFeeds.querySelector(".table tbody");
        tbodyElement.appendChild(trElement);
      }
    } else {
      console.warn("Element with id 'storedRss' not found.");
    }
  });
}
