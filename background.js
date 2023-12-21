// background.js

// Use chrome.alarms to schedule periodic tasks instead of setInterval
chrome.alarms.create("updateAlarm", {
  periodInMinutes: 0.5, // Adjust the interval as needed
});

// Add an event listener for the alarm
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "updateAlarm") {
    console.log("hello");
    chrome.tabs.query({}, function (tabs) {
      // Send the message to all tabs
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, { action: "refreshRssItems" });
      });
    });
  }
});
