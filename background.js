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


