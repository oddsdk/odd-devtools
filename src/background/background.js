let devtoolsPort

console.log('In background.js')

function injector(tabId) {
  console.log('Attempting to inject content script.')

  chrome.scripting.executeScript({
    target: { tabId },
    files: ['/src/content/content.js'],
  })
}

function devtoolsHandler(data) {
  console.log('devtools handler called with', data)

  // TODO Consider whether we need this message
  // Would be used for tracking devtools open/close state, but not sure how we do close
  if (data.type === 'devtools-open') {
    console.log('background received devtools open message with tabId:', data.tabId)

  } else if (data.type === 'inject') {
    injector(data.tabId)
  }
}

/**
 * Set up port communication from the content script to the devtools page and back again
 */
function connectionListener(port) {
  console.log(`connection from ${port.name}`)
  console.log('with port', port)

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
  console.log('message in background script', message)

  // Rewire the connection with the devtools panel
  if (!devtoolsPort) {
    devtoolsPort = chrome.runtime.connect({ name: 'background' })
  }

  devtoolsPort.postMessage(message)
})



/**
 * Detect tab closes and update conneections in storage
 * 
 * Note that we should move the remove connection to a function
 * in the connection.ts module when we can convert this script
 * to a module.
 */
chrome.tabs.onRemoved.addListener(async function (tabId) {
  console.log('tab closed', tabId)

  // Remove the connection by tabId
  const store = await chrome.storage.local.get('connections')
  console.log('store in remove tab listener', store)
  console.log('connections before removing', store.conenctions)

  // Remove connection
  if (store.connections) {
    store.connections[`${tabId}`] = undefined
  }

  // Store conenctions
  chrome.storage.local.set({ connections: store.connections })
    .catch(err => console.error('Browser storage error:', err))

  // const test = { id: tabId }
  // chrome.storage.local.set({ test })
  // console.log('Storing tabId test to storage', test)

  // const storedTest = await chrome.storage.local.get('test')
  // console.log('Stored test loaded from storage', storedTest)
})