const sessionID = crypto.randomUUID();

/**
When the user clicks the 'message' button,
send a message to the background script.
*/

function injectScript(scriptToInject) {

  // console.log('inspectedWindow', browser.devtools.inspectedWindow);
  panelPort.postMessage({
    tabId: browser.devtools.inspectedWindow.tabId,
    script: scriptToInject,
    command: 'inject'
  });
}

function requestInfo() {
  console.log('in requestInfo>');
  panelPort.postMessage({
    tabId: browser.devtools.inspectedWindow.tabId,
    command: 'info'
  });
}

// document.getElementById('inject').addEventListener('click', () => {
//   injectScript('/devtools/panel/content_script.js');
// });

document.getElementById('refresh').addEventListener('click', () => {
  requestInfo();
});

document.getElementById('ping').addEventListener('click', () => {
  panelPort.postMessage({
    tabId: browser.devtools.inspectedWindow.tabId,
    command: 'ping page'
  })
});

function handleMessage(request, sender, sendResponse) {
  console.log('from background page>', request, sender, sendResponse)
}

let panelPort = browser.runtime.connect({name: 'devtools-panel'})

panelPort.onMessage.addListener(handleMessage)

setTimeout(() => {
  // tick
  injectScript('/devtools/panel/content_script.js')
}, 0);


