// (() => {
//   const data = new Set();
//   const parent = document.querySelector('.head_div');

//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     sendResponse({ status: "Message received successfully" });

//     if (!data.has(message.url)) {
//       data.add(message.url);
//       console.log(data);
//       console.log(parent);
//       const child = document.createElement('div');
//       child.classList.add('button');
//       child.dataset.id = "id" + new Date().getTime();
//       child.innerText = message.url;
//       parent.appendChild(child);
      
//     }
//   });
// })();
(()=>{
    setInterval(()=>{
        const len = Number(localStorage.getItem('lenData')) || 0;
        chrome.storage.local.get(["data"]).then(({data})=>{
            if (!data){
                return;
            }

            const urls = Object.keys(data);

            if (len !== urls.length){
                const parent = document.querySelector(".requests");
                parent.innerHTML = "";
                
                let content = '';
                for (const url of urls){
                    const item = `<div class="button" data-state="${data[url].blocked}" style="cursor: pointer;">${url}</div>`;
                    content += item ;    
                }
                
                console.log(content);
                parent.innerHTML = content;

                localStorage.setItem('lenData', JSON.stringify(urls.length));    
            }

        });
    }, 1000);
    
})();

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
