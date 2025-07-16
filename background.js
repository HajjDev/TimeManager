import {isPresent} from "./utils/isPresent.js";

// Initialize the tab count
let tabCount = 0;
let domains = {};
const specialUrls = ['chrome://newtab', 'about:blank', 'chrome://extensions'];

// Operations on the tabCount
chrome.tabs.onCreated.addListener((tab) => {
    tabCount ++;
});
chrome.tabs.onRemoved.addListener((tab) => {
    tabCount --;
});

// Message receiver that sends a response for a particular message.
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action == "tabCount") {
        sendResponse({count: tabCount});
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.status === 'complete') {
        const domain = new URL(tab.url).hostname;
        if (!specialUrls.includes(domain)) {
            const alreadyUsedTabId = isPresent(tabId, domains);
            if (alreadyUsedTabId) {
                domains[alreadyUsedTabId]["ids"].delete(tabId);
                domains[alreadyUsedTabId]["totalTime"] += Date.now() - domains[alreadyUsedTabId]["currentTime"];
                domains[alreadyUsedTabId]["currentTime"] = Date.now();
                if (domains[alreadyUsedTabId]["ids"].size === 0) {
                    const minutes = domains[alreadyUsedTabId]["totalTime"] / (1000 * 60);
                    chrome.storage.local.get("totalTimeStorage", (data) => {
                        const totalTimeData = data.totalTimeStorage || {};
                        if (alreadyUsedTabId in totalTimeData) {
                            totalTimeData[alreadyUsedTabId] += Math.round( minutes * 1e2 ) / 1e2;
                        } else {
                            totalTimeData[alreadyUsedTabId] = Math.round( minutes * 1e2 ) / 1e2;
                        }
                        chrome.storage.local.set({"totalTimeStorage": totalTimeData});
                    })
                    domains[alreadyUsedTabId]["totalTime"] = 0;
                }
                domains[alreadyUsedTabId]["currentTime"] = Date.now();
            }
            if (domain in domains) {
                domains[domain]["ids"].add(tabId);
            } else {
                domains[domain] = {
                    "ids": new Set([tabId]),
                    "currentTime": Date.now(),
                    "totalTime": 0
                };
            }
        }
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    const idCheck = isPresent(tabId, domains);
    if (idCheck) {
        domains[idCheck]["ids"].delete(tabId);
        if (domains[idCheck]["ids"].size === 0) {
            domains[idCheck]["totalTime"] += Date.now() - domains[idCheck]["currentTime"];
            domains[idCheck]["currentTime"] = Date.now();;
            const minutes = domains[idCheck]["totalTime"] / (1000 * 60);
            chrome.storage.local.get("totalTimeStorage", (data) => {
                const totalData = data.totalTimeStorage || {};
                if (idCheck in totalData) {
                    totalData[idCheck] += Math.round( minutes * 1e2 ) / 1e2;
                } else {
                    totalData[idCheck] = Math.round( minutes * 1e2 ) / 1e2;
                }
                chrome.storage.local.set({"totalTimeStorage": totalData});
            })
        }
    }
});