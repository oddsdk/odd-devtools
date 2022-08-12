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

function handleMessage(request, sender, sendResponse) {

  console.log('in background page handler', request, sender, sendResponse);
 
  if (sender.url != browser.runtime.getURL("/devtools/panel/panel.html")) {
    console.log(`error, sender url is: ${sender.url}`)
    return;
  }

  console.log('from background page>', request);
}

let panelPort = browser.runtime.connect({name: 'devtools-panel'});

setTimeout(() => {
  // tick
  injectScript('/devtools/panel/content_script.js');
}, 0);


