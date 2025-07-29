// Make sure to initialize TotalTime and domains only 1 time.
chrome.storage.local.get("totalTimeStorage", (data) => {
    const totalData = data.totalTimeStorage || {};
    chrome.storage.local.set({"totalTimeStorage": totalData});
});

chrome.storage.local.get("domains", (data) => {
    const domainsData = data.domains || {};
    chrome.storage.local.set({"domains": domainsData});
});

chrome.tabs.query({}, (tabs) => {
    const activeTabs = tabs.length;
    document.getElementById("tabCount").textContent = activeTabs;
});