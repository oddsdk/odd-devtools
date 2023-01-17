/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/
import browser from "webextension-polyfill"

console.log(`In devtools.js`)

function handleShown(window) {
  console.log("panel is being shown", window)
  window.init()
}

function handleHidden() {
  console.log("panel is being hidden")
}

/**
Create a panel, and add listeners for panel show/hide events.
*/
browser.devtools.panels.create(
  "Webnative",
  "/src/assets/icons/star.png",
  "/src/devtools/panel.html"
).then((newPanel) => {
  console.log('panel created', newPanel)

  newPanel.onShown.addListener(handleShown);
  newPanel.onHidden.addListener(handleHidden);
})

export { }

// let panelPort, csPort;

// function csHandler(event) {
//   console.log('called csHandler', event)
// }

// function panelHandler(event) {
//   console.log('called panelHandler', event)
// }

// function addOnListener(port) {

//   console.log(`connection from ${port.name}`);

//   if (port.name === 'devtools-panel') {
//     // handle  requests from the panel
//     panelPort = port;
//     panelPort.onMessage.addListener(panelHandler)
//   }
//   else if (port.name == 'content-script') {
//     csPort = port;
//     console.log('cs port', port)
//     csPort.onMessage.addListener(csHandler)
//   }
// }

// browser.runtime.onConnect.addListener(addOnListener);

