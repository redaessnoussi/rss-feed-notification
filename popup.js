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

  for (let index = 0; index < rssItems.length; index++) {
    itemIndex = rssItems[index];
    itemTitle = itemIndex.querySelector("title").textContent;
    itemLink = itemIndex.querySelector("link").textContent;
    itemsContainer.innerHTML += `<a href="${itemLink}" target="_blank">${itemTitle}</a>`;
  }
}

function refreshRssItems() {}
