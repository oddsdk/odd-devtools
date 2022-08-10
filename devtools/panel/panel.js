/**
When the user clicks the 'message' button,
send a message to the background script.
*/

let PanelPort = browser.runtime.connect({name: 'devtools-panel'});

function injectScript(scriptToInject) {

  // console.log('inspectedWindow', browser.devtools.inspectedWindow);
  PanelPort.postMessage({
    tabId: browser.devtools.inspectedWindow.tabId,
    script: scriptToInject,
    command: 'inject'
  });
}

function requestInfo() {
  PanelPort.postMessage({
    tabId: browser.devtools.inspectedWindow.tabId,
    command: 'info'
  });
}

document.getElementById('inject').addEventListener('click', () => {
  injectScript('/devtools/panel/content_script.js');
});

document.getElementById('inject').addEventListener('click', () => {
  requestInfo('/devtools/panel/content_script.js');
});

function handleMessage(request, sender, sendResponse) {

  console.log('in background page handler', request, sender, sendResponse);
 
  if (sender.url != browser.runtime.getURL("/devtools/panel/panel.html")) {
    console.log(`error, sender url is: ${sender.url}`)
    return;
  }

  console.log('from background page>', request);
}
