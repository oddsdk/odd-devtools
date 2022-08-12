/** 

How comms works in this extension ( currently ):

1. when the dev tools are opened and our panel is viewed, we inject 
a content script into the 'inspectedWindow'
  * a message is sent from the panel to the backrgound page, which 
    then injects the script
2. the content script fires up, gathers some initial info about the 
page, 


*/

let panelPort, csPort

function panelHandler(message) {
  console.log('from the panel>', message);

  if (message.command === 'inject') {
    browser.tabs.executeScript(message.tabId, { file: message.script });
  } else if (message.command === 'info') {
    csPort.postMessage(message);
  }
}

function csHandler(message) {
  console.log('from the content script>', message);
}


/**
 * Set up port communications from the content script to the panel page and back again
 */
function addOnListener(port) {

  console.log(`connection from ${port.name}`);

  if (port.name === 'devtools-panel') {
    // handle  requests from the panel
    panelPort = port;
    panelPort.onMessage.addListener(panelHandler)
  }
  else if (port.name == 'port-from-cs') {
    csPort = port;
    console.log('cs port', port)
    csPort.onMessage.addListener(csHandler)
  }
}

browser.runtime.onConnect.addListener(addOnListener);
