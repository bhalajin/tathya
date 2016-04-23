//Receives the message from background.js and send message to client script

chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
    window.postMessage({ type: "FROM_PAGE", text: request.keyword }, "*");
});