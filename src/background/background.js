let devtoolsPort

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
  // console.log(`connection from ${port.name}`)

  if (port.name === 'devtools-page') {
    // handle  requests from the devtools page
    devtoolsPort = port
    devtoolsPort.onMessage.addListener(devtoolsHandler)
  }

}

chrome.runtime.onConnect.addListener(connectionListener)

/**
 * Listen for messages from the content script.
 * Wakes up the background service worker if it has been deactivated.
 */
chrome.runtime.onMessage.addListener(message => {
  // console.log('message in background script', message)

  // Rewire the connection with the devtools panel
  if (!devtoolsPort) {
    devtoolsPort = chrome.runtime.connect({ name: 'background' })
  }

  devtoolsPort.postMessage(message)
})