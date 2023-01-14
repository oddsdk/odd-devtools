/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/

console.log(`In devtools.js`)

function handleShown(panelWin) {
  console.log("panel is being shown", panelWin)

  panelWin.init()

}

function handleHidden() {
  console.log("panel is being hidden")
}

/**
Create a panel, and add listeners for panel show/hide events.
*/
browser.devtools.panels.create(
  "Example panel",
  "/icons/star.png",
  "panel.html"
).then((newPanel) => {
  newPanel.onShown.addListener(handleShown);
  newPanel.onHidden.addListener(handleHidden);
}); 

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

