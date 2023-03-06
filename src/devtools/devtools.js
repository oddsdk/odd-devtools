import { writable } from 'svelte/store'
import browser from 'webextension-polyfill'

import * as connectionStorage from '../storage/connection'

console.log(`In devtools.js - tabId: ${browser.devtools.inspectedWindow.tabId}`)


// INIT 

// Connect with the background script
let backgroundPort = browser.runtime.connect({ name: 'devtools-page' })
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

// Load connection from local storage and set connection store
// when the devtools are opened.
connectionStorage.get(tabId).then(async storedConnection => {
  console.log('stored connection', storedConnection)

  if (storedConnection) {
    connection.update(state => ({ ...state, connected: storedConnection.connected }))
    
    if (storedConnection.connected) await connect()
  }
})

// browser.storage.local.get([`${tabId}`]).then(result => {
//   let storedConnection = result[`${tabId}`]

//   console.log('result from storage', result)
//   console.log('Connection state loaded from extension storage', storedConnection)

//   if (storedConnection?.connected) {
//     connection.update(state => ({...state, connected: storedConnection.connected}) )
//   }
// })


// TODO Can we set the connection to false when the tab is first opened? No, the devtools aren't active yet

// TODO Delete the state in storage when a tab is closed. This may need to happen in the background?
// What if the devtools aren't open when the tab is closed
// Won't work, can't count on devtools being open
// chrome.tabs.onRemoved.addListener(function(tabId, removed) {
//   console.log('tab closed', tabId)
// })

// Or instead, keep the state but remove tab connection information if tabs are not 
// open each time we initialize the devtools panel is opened
//
// Use https://developer.chrome.com/docs/extensions/reference/tabs/#method-query and
// query with url, pendingUrl, title, and favIconUrl properties set to false to avoid
// triggering tabs permission (is this possible? Without the permission, these should be
// omitted from the query results)
//
// Possible alternative is chrome.tabs.get, for each stored tabId

// TODO Load state when the page reloads, update connection store and re-establish connection with Webnative
// Note the tab should have remained open for connection tracking, on first load connected should be false
// The first page load may be redundant since we'll already call this above

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
    connectionStorage.update({ tabId, connected: true })
  } else if (event.type === 'disconnect') {
    console.log('received disconnect message from Webnative', event)

    eventType.set(event.type)
    eventHistory.update(history => [...history, event.type])
    state.set(event.state)

    connection.update(store => ({ ...store, connected: false }))
    connectionStorage.update({ tabId, connected: false })
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
  } else {
    console.log('received an unknown message type', event)
  }
}