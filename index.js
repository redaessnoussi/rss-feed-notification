//index.js

document.addEventListener("DOMContentLoaded", function () {
  const popupFrame = document.getElementById("popupFrame");
  const addFrame = document.getElementById("addFrame");
  const checkFrame = document.getElementById("checkFrame");

  const pagesArray = [popupFrame, addFrame, checkFrame];

  const previousBtn = document.getElementById("previousBtn");
  const nextBtn = document.getElementById("nextBtn");

  let pageIndex = 0;

  previousBtn.addEventListener("click", function () {
    if (pageIndex > 0) {
      pageIndex--;
      showFrame(pagesArray[pageIndex]);
      const currentPageType =
        pagesArray[pageIndex].getAttribute("data-page-type");
      currentPageType === "check" && fetchRssItems(pageIndex);
    }
  });

  nextBtn.addEventListener("click", function () {
    if (pageIndex < pagesArray.length - 1) {
      pageIndex++;
      showFrame(pagesArray[pageIndex]);
      const currentPageType =
        pagesArray[pageIndex].getAttribute("data-page-type");
      currentPageType === "check" && fetchRssItems(pageIndex);
    }
  });

  // Listen for messages from the background or other parts of the extension
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "showPopup") {
      showFrame(popupFrame);
    } else if (request.action === "showAdd") {
      pageIndex = 1;
      showFrame(addFrame);
    } else if (request.action === "showCheck") {
      pageIndex = 2;
      showFrame(checkFrame);
      fetchRssItems(pageIndex);
      sendMessageToIndex("showCheck");
    }
  });
});

function sendMessageToIndex(action) {
  // Send a message to the background script with the selected action
  chrome.runtime.sendMessage({ action: action });
}

function showFrame(frameToShow) {
  // Hide all frames
  document.getElementById("popupFrame").style.display = "none";
  document.getElementById("addFrame").style.display = "none";
  document.getElementById("checkFrame").style.display = "none";

  // Show the selected frame
  frameToShow.style.display = "block";
}

function fetchRssItems(pageIndex) {
  // Send a message to the background script to fetch RSS items
  chrome.runtime.sendMessage({ action: "fetchItemsPage", data: pageIndex });
}
