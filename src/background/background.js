const devtoolsPorts = {}

console.log('In background.js')

function injector(tabId) {
  // console.log('Attempting to inject content script.')

  chrome.scripting.executeScript({
    target: { tabId },
    files: ['/src/content/content.js'],
  })
}

function devtoolsHandler(data) {
  // console.log('devtools handler called with', data)

  if (data.type === 'inject') {
    injector(data.tabId)
  }
}

/**
 * Set up port communication from the content script to the devtools page and back again
 */
function connectionListener(port) {
  const [prefix, tabId] = port.name.split('-')

  if (prefix === 'odd_devtools') {
    devtoolsPorts[`${tabId}`] = port
    devtoolsPorts[`${tabId}`].onMessage.addListener(devtoolsHandler)
  }
}

chrome.runtime.onConnect.addListener(connectionListener)

/**
 * Listen for messages from the content script.
 * Wakes up the background service worker if it has been deactivated.
 */
chrome.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id

  // Messages may come from places other than tabs or
  // be missing an id. Ignore these.
  if (!tabId) return

  // console.log('message from tabId', tabId, 'in background script', message)

  // Rewire the connection with the devtools panel
  if (!devtoolsPorts[`${tabId}`]) {
    devtoolsPorts[`${tabId}`] = chrome.runtime.connect({ name: `odd_background-${tabId}`})
  }

  devtoolsPorts[`${tabId}`].postMessage(message)
})