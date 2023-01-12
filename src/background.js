let panelPort, csPort

console.log(`In background.js`)

function panelHandler(message) {
  console.log('from the panel>', message);

  if (message.command === 'inject') {
    browser.tabs.executeScript(message.tabId, { file: 'browser-polyfill.js' });
    browser.tabs.executeScript(message.tabId, { file: message.script });
  } 
  else if (message.command === 'info') {
    csPort.postMessage(message);
  }
  else if (message.command === 'ping page') {
    csPort.postMessage(message);
  }
}

function csHandler(message) {
  console.log('from the content script>', message)
  panelPort.postMessage(message)
}

/**
 * When we receive the message, execute the given script in the given
 * tab.
 */
function injectContentScript(message) {

  console.log('background page>', message);

  browser.tabs.executeScript(message.tabId, { file: message.script });
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
