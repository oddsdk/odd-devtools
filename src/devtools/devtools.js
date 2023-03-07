import { writable } from 'svelte/store'
import browser from 'webextension-polyfill'

import * as connectionStorage from '../storage/connection'

console.log(`In devtools.js - tabId: ${browser.devtools.inspectedWindow.tabId}`)


// INIT 

// Connect with the background script
let backgroundPort = browser.runtime.connect({ name: 'devtools-page' })
backgroundPort.postMessage({ type: 'devtools-open', tabId: browser.devtools.inspectedWindow.tabId.toString() })
backgroundPort.onMessage.addListener(handleBackgroundMessage)

// Create a panel, and add listeners for panel show/hide events.
browser.devtools.panels.create(
  'Webnative',
  '/webnative16.png',
  '/src/devtools/panel.html'
).then(panel => {
  console.log('panel created', panel)

  panel.onShown.addListener(handleShown)
})


// PANEL

let panelInitialized = false

function handleShown(window) {
  console.log('panel is being shown', window)

  if (!panelInitialized) {
    backgroundPort.postMessage({
      type: 'inject',
      tabId: browser.devtools.inspectedWindow.tabId
    })

    panelInitialized = true
  }
}


// BACKGROUND

/**
 * Rewire connection with the background script on message
 */
function handleBackgroundConnection(port) {
  console.log('connection in devtools page from ', port.name)

  if (port.name === 'background') {
    backgroundPort = port
    backgroundPort.onMessage.addListener(handleBackgroundMessage)
  }
}

chrome.runtime.onConnect.addListener(handleBackgroundConnection)


// WEBNATIVE CONNECTION

const tabId = browser.devtools.inspectedWindow.tabId.toString()
export const connection = writable({ tabId, connected: false })

// Load connection from local storage and reconnect if needed
connectionStorage.get(tabId).then(async storedConnection => {
  console.log('stored connection', storedConnection)

  if (storedConnection) {
    connection.update(state => ({ ...state, connected: storedConnection.connected }))

    if (storedConnection.connected) await connect()
  }
})

// browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   // console.log('tab updated', tabId, '--', changeInfo, '--', tab)

//   if (changeInfo.status == 'complete' && tab.active) {

//     console.log('tab updated', tabId)
//     console.log('with change info', changeInfo)
//     console.log('with tab', tab)

//   }
// })


// browser.webNavigation.onCompleted.addListener(async ({ tabId }) => {
// browser.webNavigation.onCompleted.addListener(async event  => {
//   const { frameId, tabId, timeStamp } = event
//   console.log('On complete navigation event', event)

//   // await reconnect(tabId, timeStamp)

//   if (frameId === 0 && tabId === browser.devtools.inspectedWindow.tabId) {
//     console.log('navigation in the current tab', tabId)

//     const storedConnection = await connectionStorage.get(tabId)

//     if (storedConnection) {
//       // Re-inject the content script
//       backgroundPort.postMessage({
//         type: 'inject',
//         tabId: browser.devtools.inspectedWindow.tabId
//       })

//       console.log('stored connection in onComplete', storedConnection)
//       connection.update(state => ({ ...state, connected: storedConnection.connected }))

//       if (storedConnection.connected) await connect()

//       // if (storedConnection.connected) {
//       //   const interval = setInterval(async () => {
//       //     const { connecting }= await connect()

//       //     console.log('connecting on reload', connecting)

//       //     if (connecting) clearInterval(interval)
//       //   }, 1000)

//       // }
//     }
//   }
// })


// function createReconnect() {
//   let lastTimeStamp 

//   return async (tabId, timeStamp) => {
//     console.log('timeStamp', timeStamp)
//     console.log('lastTimeStamp', lastTimeStamp)

//     // Filter out repeated events
//     if (timeStamp === lastTimeStamp) return
//     lastTimeStamp = timeStamp

//     console.log('lastTimeStamp set to', lastTimeStamp)

//     if (tabId === browser.devtools.inspectedWindow.tabId) {
//       console.log('navigation in the current tab', tabId)

//       const storedConnection = await connectionStorage.get(tabId)

//       if (storedConnection) {
//         // Re-inject the content script
//         backgroundPort.postMessage({
//           type: 'inject',
//           tabId: browser.devtools.inspectedWindow.tabId
//         })

//         console.log('stored connection in onComplete', storedConnection)
//         connection.update(state => ({ ...state, connected: storedConnection.connected }))

//         if (storedConnection.connected) await connect()
//       }
//     }
//   }
// }

// const reconnect = createReconnect()

export async function connect() {
  console.log('connecting to Webnative')

  const [connecting, err] = await browser.devtools.inspectedWindow.eval(`
    if (window.__webnative?.extension) {
      window.__webnative.extension.connect('${chrome.runtime.id}')
      true
    } else {
      false
    }`
  )

  if (err) console.error(err)

  return { connecting }
}

export async function disconnect() {
  console.log('disconnecting from Webnative')

  const [disconnecting, err] = await browser.devtools.inspectedWindow.eval(`
    if (window.__webnative?.extension) {
      window.__webnative.extension.disconnect('${chrome.runtime.id}')
      true
    } else {
      false
    }`
  )

  if (err) console.error(err)

  return { disconnecting }
}

async function reconnect(storedConnection) {
  // Re-inject the content script
  backgroundPort.postMessage({
    type: 'inject',
    tabId: browser.devtools.inspectedWindow.tabId
  })

  console.log('stored connection in reconnect', storedConnection)
  connection.update(state => ({ ...state, connected: storedConnection.connected }))

  // if (storedConnection.connected) await connect()
  if (storedConnection.connected) setTimeout(async () => { 
    const { connecting } = await connect() 
    
    console.log('connecting status after calling connect', connecting)
  }, 50)
}

// MESSAGES

export const state = writable({})
export const eventType = writable({})
export const detail = writable(null)
export const eventHistory = writable([])

function handleBackgroundMessage(event) {
  console.log('panel port onMessage', event)

  if (event.type === 'connect') {
    console.log('received connect message from Webnative', event)

    eventType.set(event.type)
    eventHistory.update(history => [...history, event.type])
    state.set(event.state)

    connection.update(store => ({ ...store, connected: true }))
    connectionStorage.set({ tabId, connected: true })
  } else if (event.type === 'disconnect') {
    console.log('received disconnect message from Webnative', event)

    eventType.set(event.type)
    eventHistory.update(history => [...history, event.type])
    state.set(event.state)

    connection.update(store => ({ ...store, connected: false }))
    connectionStorage.set({ tabId, connected: false })
  } else if (event.type === 'session') {
    console.log('received session event', event)

    eventType.set(`${event.type} ${event.detail.type}`)
    eventHistory.update(history => [...history, `${event.type} ${event.detail.type}`])
    detail.set(event.detail)
    state.set(event.state)
  } else if (event.type === 'filesystem') {
    console.log('received filesystem event', event)

    eventType.set(`${event.type} ${event.detail.type}`)
    eventHistory.update(history => [...history, `${event.type} ${event.detail.type}`])
    detail.set(event.detail)
    state.set(event.state)
  } else if (event.type === 'pageload') {
    console.log('received page load event', event)

    connectionStorage.get(tabId).then(storedConnection => {
      if (storedConnection) {
        // reconnect(storedConnection)
        // .catch(err => console.error('Unable to reconnect to Webnative:', err))

        setTimeout(() => reconnect(storedConnection)
          .catch(err => console.error('Unable to reconnect to Webnative:', err)), 1000)
      }
    })
  } else {
    console.log('received an unknown message type', event)
  }
}