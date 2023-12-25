document.addEventListener("DOMContentLoaded", function () {
  const popupFrame = document.getElementById("popupFrame");
  const addFrame = document.getElementById("addFrame");
  const checkFrame = document.getElementById("checkFrame");

  const pagesArray = [popupFrame, addFrame, checkFrame];

  const previousBtn = document.getElementById("previousBtn");
  const nextBtn = document.getElementById("nextBtn");

  var pageIndex = 0;

  previousBtn.addEventListener("click", function () {
    if (pageIndex > 0) {
      pageIndex--;
      showFrame(pagesArray[pageIndex]);
      console.log("Previous");
    }
  });

  nextBtn.addEventListener("click", function () {
    if (pageIndex < pagesArray.length - 1) {
      pageIndex++;
      showFrame(pagesArray[pageIndex]);
      console.log("Next");
    }
  });

  // Listen for messages from popup.html
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
    }
  });
});

function showFrame(frameToShow) {
  // Hide all frames
  document.getElementById("popupFrame").style.display = "none";
  document.getElementById("addFrame").style.display = "none";
  document.getElementById("checkFrame").style.display = "none";

  // Show the selected frame
  frameToShow.style.display = "block";
}
