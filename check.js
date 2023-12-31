// Function to handle messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "selectedFeedItem") {
    var selectedItem = request.data;

    // console.log("selectedItem.rssURL", selectedItem.rssURL);

    fetchRssData(selectedItem.rssURL);
  }

  if (request.action === "fetchItemsPage") {
    var fetchPage = request.data;

    fetchPage && fetchItemsOnPageLoad();
  }

  if (request.action === "updateItems") {
    fetchItemsOnPageLoad();
  }
});

function fetchItemsOnPageLoad() {
  chrome.storage.sync.get(["selectedRssURL"], function (result) {
    var selectedRssURL = result.selectedRssURL;
    // console.log("selectedRssURL :", selectedRssURL);
    selectedRssURL && fetchRssData(selectedRssURL);
  });
}

// FETCH THE RSS DATA FROM THE URL
async function fetchRssData(rssURL) {
  try {
    // console.log("fetchRssData :", rssURL);
    const response = await fetch(rssURL);
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");

    dashbaordTitle(xmlDoc);
    showItems(xmlDoc);
  } catch (error) {
    console.error("Error fetching RSS data:", error);
  }
}

// APPEND THE TITLE CONTAINER WITH RSS TITLE
function dashbaordTitle(xmlDoc) {
  var titleContainer = document.getElementById("rssTitle");

  rssTitle = xmlDoc.querySelector("channel title")?.textContent || "";
  rssDescription =
    xmlDoc.querySelector("channel description")?.textContent || "";

  titleContainer.innerHTML = `<h6>${rssTitle}</h6><p class="small mb-4">${rssDescription}</p>`;
}

// SHOW ITEMS OF RSS AND APPEND THEM TO THE LOOP
function showItems(xmlDoc) {
  var itemsContainer = document.getElementById("rssItems");
  itemsContainer.innerHTML = "";

  rssItems = xmlDoc.getElementsByTagName("item");

  // LOOP TROUGHT THE ITEMS AND APPEND THE TITLE AND LINK VALUE TO THE HTML CONTAINER
  for (let index = 0; index < rssItems.length; index++) {
    itemIndex = rssItems[index];
    itemTitle = itemIndex.querySelector("title")?.textContent || "";
    itemLink = itemIndex.querySelector("link")?.textContent || "";
    itemsContainer.innerHTML += `<p class="small m-1"><a href="${itemLink}" target="_blank">${itemTitle}</a></p><hr class="m-0">`;
  }

  lastItemTitle = rssItems[0]?.querySelector("title")?.textContent || "";
  // Update the saved title in storage
  chrome.storage.sync.set({ savedTitle: lastItemTitle });
}
