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

let contentScriptInjected = false

function handleShown(window) {
  console.log('** Content script injected in panel handleShown', contentScriptInjected)

  if (!contentScriptInjected) {
    backgroundPort.postMessage({
      type: 'inject',
      tabId: browser.devtools.inspectedWindow.tabId
    })

    contentScriptInjected = true
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
  console.log('** Content script injected in panel handleShown', contentScriptInjected)

  // Re-inject the content script
  if (!contentScriptInjected) {
    backgroundPort.postMessage({
      type: 'inject',
      tabId: browser.devtools.inspectedWindow.tabId
    })

    contentScriptInjected = true
  }

  console.log('stored connection in reconnect', storedConnection)
  connection.update(state => ({ ...state, connected: storedConnection.connected }))

  if (storedConnection.connected) {
    const { connecting } = await connect()

    console.log('connecting status after attempting to reconnect', connecting)
  }
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
      if (storedConnection?.connected) { 
        reconnect(storedConnection).catch(err => console.log('Unable to reconnect with Webnative', err))
      }
    })
  } else {
    console.log('received an unknown message type', event)
  }
}