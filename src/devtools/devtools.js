/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/
import browser from 'webextension-polyfill'

console.log('In devtools.js')

let panelInitialized = false

function handleShown(window) {
  console.log('panel is being shown', window)

  if (!panelInitialized) {
    window.init()

    panelInitialized = true
  }

  console.log('extension id in devtools panel', chrome.runtime.id)

  browser.devtools.inspectedWindow.eval(`
    if (window.__webnative.extension) {
      window.__webnative.extension.connect('${chrome.runtime.id}')
    } else {
      console.log("connect to webanative not defined.")
    }`
  )
}

function handleHidden() {
  browser.devtools.inspectedWindow.eval(`
    if (window.__webnative.extension) {
      window.__webnative.extension.disconnect('${chrome.runtime.id}')
    } else {
      console.log("disconnect from webanative not defined.")
    }`
  )

  console.log('panel is being hidden')
}

/**
Create a panel, and add listeners for panel show/hide events.
*/
browser.devtools.panels.create(
  'Webnative',
  '/webnative16.png',
  '/src/devtools/panel.html'
).then((newPanel) => {
  console.log('panel created', newPanel)

  newPanel.onShown.addListener(handleShown)
  newPanel.onHidden.addListener(handleHidden)
})

export { }