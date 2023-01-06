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

document.getElementById('page-info').addEventListener('click', () => {
  getPageInfo((msg) => {
    // console.log(`getPageInfo::${msg}`);
    logInPage(`getPageInfo::${msg}`, 'log', true) // should be logged on both sides.
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

function getPageInfo(callback) {
  chrome.devtools.inspectedWindow.eval(
    "navigator.webnative.version",
    function(result, isException) {
      if (isException) {
        callback("Webnative is not loaded.");
      } else {
        callback(`Webnative version ${result} is loaded.`);
      }
    }
  );
}

function logInPage(message, level, debug) {
  let levels = [ 'log', 'warn', 'error', 'info' ];

  if (!levels.includes(level)) {
    console.warn(`Invalid level supplied: ${level}, needs to be one of ${levels.join(',')}`);
    level = 'log'; // default log level
  }

  chrome.devtools.inspectedWindow.eval(
    `console.${level}('From devtools: ${message}')`,
    function (result, isException) {
      if (isException) {
        console.error(`Exception thrown trying to log to the page: ${result}`)
      }
      else {
        if (debug === true) {
          console.log(`DEBUG: Logged ${message} to the page console.`)
        }
      }
    }
  );  
}
