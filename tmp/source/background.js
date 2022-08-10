console.log(`got here...`)

// for (let tab of tabs) {
//   console.log(tab.url)
// }


chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  // assign the listener function to a variable so we can remove it later
  var devToolsListener = function(message, sender, sendResponse) {
      // Inject a content script into the identified tab
      console.log('background>', message, sender, sendResponse)
      browser.scripting.executeScript(
        message.tabId,
        { file: message.scriptToInject }
      );
  }
  // add the listener
  devToolsConnection.onMessage.addListener(devToolsListener);

  devToolsConnection.onDisconnect.addListener(function() {
       devToolsConnection.onMessage.removeListener(devToolsListener);
  });
});
