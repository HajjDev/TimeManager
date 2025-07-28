"use strict";

chrome.webRequest.onBeforeRequest.addListener(function(details){
    const url = new URL(details.url);

    const updateData = async ()=>{
        let tmp = await chrome.storage.local.get(["data"]);
        let data = tmp.data;

        if (!tmp || !data){
             data = {};
        }
        
        
        if (!(url.hostname in data)){
            data[url.hostname] = {blocked:false};
            chrome.storage.local.set({ data:{...data} });
        }

    }
    
    updateData();

    }, 
    {urls:["<all_urls>"]},

    []
);


import {isPresent} from "./utils/isPresent.js";

// Initialize the tab count
let tabCount = 0;
const specialUrls = ['newtab', 'about:blank', 'extensions'];

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
            chrome.storage.local.get("domains", (data) => {
                const domains = data.domains || {};
                for (const domain in domains) {
                    console.log(domain);
                    if (Array.isArray(domains[domain]["ids"])) {
                        domains[domain]["ids"] = new Set(domains[domain]["ids"]);
                    }
                }
                console.log(domains);
                const alreadyUsedTabId = isPresent(tabId, domains);
                if (alreadyUsedTabId) {
                    domains[alreadyUsedTabId]["ids"].delete(tabId);
                    domains[alreadyUsedTabId]["totalTime"] += Date.now() - domains[alreadyUsedTabId]["currentTime"];
                    domains[alreadyUsedTabId]["currentTime"] = Date.now();
                    if (domains[alreadyUsedTabId]["ids"].size === 0) {
                        console.log("hii");
                        const minutes = domains[alreadyUsedTabId]["totalTime"] / (1000 * 60);
                        domains[alreadyUsedTabId]["currentTime"] = 0;
                        console.log(`domain: ${domains}`);
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
                    } else {
                        domains[alreadyUsedTabId]["totalTime"] += Date.now() - domains[alreadyUsedTabId]["currentTime"];
                        domains[alreadyUsedTabId]["currentTime"] = Date.now();
                    }
                }
                if (domain in domains) {
                    domains[domain]["ids"].add(tabId);
                    if (domains[domain]["ids"].size === 1) {
                        domains[domain]["currentTime"] = Date.now();
                    }
                } else {
                    domains[domain] = {
                        "ids": new Set([tabId]),
                        "currentTime": Date.now(),
                        "totalTime": 0
                    };
                }
                for (const domain in domains) {
                    if (domains[domain]['ids'] instanceof Set) {
                        domains[domain]['ids'] = Array.from(domains[domain]['ids']);
                    }
                }
                chrome.storage.local.set({"domains": domains});
            })
        }
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.storage.local.get("domains", (data) => {
        const domains = data.domains || {};
        for (const domain in domains) {
            if (Array.isArray(domains[domain]["ids"])) {
                domains[domain]["ids"] = new Set(domains[domain]["ids"]);
            }
        }
        const idCheck = isPresent(tabId, domains);
        if (idCheck) {
            domains[idCheck]["ids"].delete(tabId);
            if (domains[idCheck]["ids"].size === 0) {
                domains[idCheck]["totalTime"] += Date.now() - domains[idCheck]["currentTime"];
                domains[idCheck]["currentTime"] = 0;
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
                domains[idCheck]["totalTime"] = 0;
            } else {
                domains[idCheck]["totalTime"] += Date.now() - domains[idCheck]["currentTime"];
                domains[idCheck]["currentTime"] = Date.now();
            }
        }
        for (const domain in domains) {
            if (domains[domain]['ids'] instanceof Set) {
                domains[domain]['ids'] = Array.from(domains[domain]['ids']);
            }
        }
        chrome.storage.local.set({"domains": domains});
    })
});
