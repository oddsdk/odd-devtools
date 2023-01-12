/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/

console.log(`In devtools.js`)

let initialized = false;

function handleShown(panelWin) {
  console.log("panel is being shown", panelWin)
  if (!initialized) {
    panelWin.init()
    initialized = true;
  }
  else {
    panelWin.shown()
  }
  
}

function handleHidden() {
  console.log("panel is being hidden");
}

/**
Create a panel, and add listeners for panel show/hide events.
*/
browser.devtools.panels.create(
  "My Panel",
  "/icons/star.png",
  "/devtools/panel/panel.html"
).then((newPanel) => {
  newPanel.onShown.addListener(handleShown);
  newPanel.onHidden.addListener(handleHidden);
}); 

