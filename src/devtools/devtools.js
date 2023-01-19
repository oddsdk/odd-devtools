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