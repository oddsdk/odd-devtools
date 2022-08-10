/** 

How comms works in this extension ( currently ):

1. when the dev tools are opened and our panel is viewed, we inject 
a content script into the 'inspectedWindow'
  * a message is sent from the panel to the backrgound page, which 
    then injects the script
2. the content script fires up, gathers some initial info about the 
page, 


*/


/**
 * When we receive the message, execute the given script in the given
 * tab.
 */
function injectContentScript(message) {

  console.log('background page>', message);

  browser.tabs.executeScript(message.tabId, { file: message.script });
}

/**
 * Listen for messages from our devtools panel.
 */
// browser.runtime.onMessage.addListener(handleMessage)

function addOnListener(port) {
  console.log('connected>', port.name);

  if (port.name === 'devtools-panel') {
    // handle  requests from the panel
    port.onMessage.addListener((message) => {
      //
      console.log('from the panel>', message);

      if (message.command === 'inject') {
        injectContentScript(message)

      } else if (message.command === 'info') {

      }
    })
  }
}

browser.runtime.onConnect.addListener(addOnListener);
