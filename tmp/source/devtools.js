console.log('in devtools.js')

// chrome.devtools.panels.create( "Webnative",
//     "icon.png",
//     "panel.html",
//     function(panel) {
//       //
//       console.log('in devtools, ', panel)
//     }
// );

function initialisePanel() {
  console.log(`called initialisePanel`)
}

function unInitialisePanel() {
  console.log(`called unInitialisePanel`)
}

browser.devtools.panels.create(
  "Web Native Devtools",                      // title
  "./icon.png",                // icon
  "./panel.html",      // content
  function (panel) {
    console.log(`after panels.create ....`)
    console.log('panel>', panel)

    chrome.devtools.inspectedWindow.eval(
      "console.log('I evald this!')",
      function(result, isException) {
        console.log('eval result', result, isException);
      }
    );

  }
)

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: 'panel'
});

backgroundPageConnection.postMessage({
  name: 'inject',
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: 'content_script.js'
});

backgroundPageConnection.onMessage.addListener(function(msg) {
  console.log( 'devtools.js>', msg );
});