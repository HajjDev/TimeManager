// Sends a message to the background requesting the tabCount.
chrome.runtime.sendMessage({action: "tabCount"}, (res) => {
    document.getElementById("tabCount").textContent = res.count;
})

// Make sure to initialize TotalTime and domains only 1 time.
chrome.storage.local.get("totalTimeStorage", (data) => {
    const totalData = data.totalTimeStorage || {};
    chrome.storage.local.set({"totalTimeStorage": totalData});
})

chrome.storage.local.get("domains", (data) => {
    const domainsData = data.domains || {};
    chrome.storage.local.set({"domains": domainsData});
})