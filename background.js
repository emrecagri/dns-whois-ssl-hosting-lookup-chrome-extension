chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({id: "copyTitle", title: "Baş Harfleri Büyüt Kopyala", contexts: ["selection"]});
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if(info.menuItemId === "copyTitle" && info.selectionText) {
        const txt = info.selectionText.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
        chrome.scripting.executeScript({
            target: {tabId: tab.id}, func: (t) => navigator.clipboard.writeText(t), args: [txt]
        });
    }
});

// Kurulumda Context Menu Ekle
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "analyzeDomain",
        title: "Eklenti ile Tara: '%s'",
        contexts: ["selection"]
    });
});

// Sağ tık aksiyonu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "analyzeDomain") {
        // Seçili metni kaydet ve paneli aç
        chrome.storage.local.set({ 'pendingDomain': info.selectionText.trim() });
        
        // Yan Paneli o anki pencerede aç
        chrome.sidePanel.open({ windowId: tab.windowId });
    }
});

// İkon tıklanınca da yan panel açılsın
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
});