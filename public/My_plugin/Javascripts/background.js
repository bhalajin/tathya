//Receives the message from the omnibox and runs in background
chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
        console.log('inputChanged: ' + text);
        suggest([
            {content: text + " one", description: "the first one"},
            {content: text + " number two", description: "the second entry"}
        ]);
    }
);



// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function(text) {
        var newURL = "http://localhost:3000/";
        chrome.tabs.getCurrent(function (tab) {
            chrome.tabs.update({ url: newURL });
        });
        window.setTimeout(function (){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {keyword: text}, function(response) {
                    console.log(response.farewell);
                });
            });
        } ,2000);   
  });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });