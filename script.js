// Sends a message to the background requesting the tabCount.
chrome.runtime.sendMessage({action: "tabCount"}, (res) => {
    document.getElementById("tabCount").textContent = res.count;
})

// Make sure to initialize TotalTime only 1 time.
chrome.storage.local.get("totalTimeStorage", (data) => {
    const totalData = data.totalTime || {};
    chrome.storage.local.set({"totalTimeStorage": totalData});
})