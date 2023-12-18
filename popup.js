// popup.js

document.addEventListener("DOMContentLoaded", function () {
  var readRSSButton = document.getElementById("fetchRSS");
  readRSSButton.addEventListener("click", function () {
    readRssUrl();
  });
});

// READ THE RSS URL FROM THE INPUT
function readRssUrl() {
  var rssInput = document.getElementById("rssInput");
  var rssURL = rssInput.value.trim();

  fetchRssData(rssURL);
}

// FETCH THE RSS DATA FROM THE URL
function fetchRssData(rssURL) {
  fetch(rssURL)
    .then((response) => response.text())
    .then((data) => {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(data, "text/xml");

      dashbaordTitle(xmlDoc);
      showItems(xmlDoc);
    });
}

// APPEND THE TITLE CONTAINER WITH RSS TITLE
function dashbaordTitle(xmlDoc) {
  var titleContainer = document.getElementById("rssTitle");

  rssTitle = xmlDoc.querySelector("channel title").textContent;
  rssDescription = xmlDoc.querySelector("channel description").textContent;

  titleContainer.innerHTML = `<h3>${rssTitle}</h3><p>${rssDescription}</p>`;
}

// SHOW ITEMS OF RSS AND APPEND THEM TO THE LOOP
function showItems(xmlDoc) {
  var itemsContainer = document.getElementById("rssItems");
  itemsContainer.innerHTML = "";

  rssItems = xmlDoc.getElementsByTagName("item");

  // LOOP TROUGHT THE ITEMS AND APPEND THE TITLE AND LINK VALUE TO THE HTML CONTAINER
  for (let index = 0; index < rssItems.length; index++) {
    itemIndex = rssItems[index];
    itemTitle = itemIndex.querySelector("title").textContent;
    itemLink = itemIndex.querySelector("link").textContent;
    itemsContainer.innerHTML += `<p><a href="${itemLink}" target="_blank">${itemTitle}</a></p>`;
  }

  lastItemTitle = rssItems[0].querySelector("title").textContent;
  // Update the saved title in storage
  chrome.storage.sync.set({ savedTitle: lastItemTitle });

  // No need to call refreshRssItems here, as it is now handled by the background script
}

// REMOVE THE REFRESH RSS ITEMS FUNCTION FROM popup.js

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
