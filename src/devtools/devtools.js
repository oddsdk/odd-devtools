import { writable } from 'svelte/store'
import browser from 'webextension-polyfill'

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

export function connect() {
  console.log('connecting to Webnative')

  browser.devtools.inspectedWindow.eval(`
    if (window.__webnative.extension) {
      window.__webnative.extension.connect('${chrome.runtime.id}')
    } else {
      console.log("connect to webanative not defined.")
    }`
  )
}

export function disconnect() {
  console.log('disconnecting from Webnative')

  browser.devtools.inspectedWindow.eval(`
    if (window.__webnative.extension) {
      window.__webnative.extension.disconnect('${chrome.runtime.id}')
    } else {
      console.log("disconnect from webanative not defined.")
    }`
  )
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
    state.set(event.state)
    eventType.set(event.type)
    eventHistory.update(history => [...history, event.type])
  } else if (event.type === 'disconnect') {
    console.log('received disconnect message from Webnative', event)

    eventType.set(event.type)
    eventHistory.update(history => [...history, event.type])

    state.set(event.state)
  } else if (event.type === 'session') {
    console.log('received session event', event)

    eventType.set(`${event.type} ${event.detail.type}`)
    eventHistory.update(history => [...history, `${event.type} ${event.detail.type}`])

    state.set(event.state)
    detail.set(event.detail)
  } else if (event.type === 'filesystem') {
    console.log('received filesystem event', event)

    eventType.set(`${event.type} ${event.detail.type}`)
    eventHistory.update(history => [...history, `${event.type} ${event.detail.type}`])

    state.set(event.state)
    detail.set(event.detail)
  } else {
    console.log('received an unknown message type', event)
  }
}