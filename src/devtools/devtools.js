import { get as getStore, writable } from 'svelte/store'
import browser from 'webextension-polyfill'

import * as messages from '../storage/messages'

console.log(`In devtools.js - tabId: ${browser.devtools.inspectedWindow.tabId}`)

const tabId = browser.devtools.inspectedWindow.tabId

// INIT 

// Connect with the background script
let backgroundPort = browser.runtime.connect({ name: 'devtools-page' })
backgroundPort.onMessage.addListener(handleBackgroundMessage)

// Create a panel, and add listeners for panel show/hide events.
browser.devtools.panels.create(
  'Webnative',
  '/webnative16.png',
  '/src/devtools/panel.html'
)

// Injet content script
backgroundPort.postMessage({
  type: 'inject',
  tabId
})

// Connect with Webnative
connect()


// BACKGROUND

/**
 * Rewire connection with the background script on message
 */
function handleBackgroundConnection(port) {
  // console.log('connection in devtools page from ', port.name)

  if (port.name === 'background') {
    backgroundPort = port
    backgroundPort.onMessage.addListener(handleBackgroundMessage)
  }
}

chrome.runtime.onConnect.addListener(handleBackgroundConnection)


// WEBNATIVE CONNECTION

export const connection = writable({ tabId, connected: false, error: null })

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

  if (!connecting) {
    connection.update(store => ({...store, error: 'DebugModeOff'}))
  } else if (err) {
    connection.update(store => ({...store, error: 'EvalFailed'}))
    console.error('Inspected window eval error: ', err )
  }
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

  if (!disconnecting) {
    connection.update(store => ({...store, error: 'DebugModeOff'}))
  } else if (err) {
    connection.update(store => ({...store, error: 'EvalFailed'}))
    console.error('Inspected window eval error: ', err )
  }
}


// MESSAGES

export const eventStore = writable([])


function handleBackgroundMessage(event) {
  if (event.type === 'connect') {
    console.log('received connect message from Webnative', event)

    if (getStore(eventStore).length === 0) {
      const namespace = event.state.app.namespace 

      messages.get(namespace).then(messages => {
        eventStore.set(messages)
      })
    }

    connection.update(store => ({ ...store, connected: true }))
  } else if (event.type === 'disconnect') {
    console.log('received disconnect message from Webnative', event)

    connection.update(store => ({ ...store, connected: false }))
  } else if (event.type === 'session') {
    console.log('received session event', event)

    eventStore.update(history => [...history, event])
    messages.set(event.state.app.namespace, getStore(eventStore))
  } else if (event.type === 'filesystem') {
    console.log('received filesystem event', event)

    eventStore.update(history => [...history, event])
    messages.set(event.state.app.namespace, getStore(eventStore))
  } else if (event.type === 'pageload') {
    console.log('received page load event', event)

    // Inject content script if missing
    backgroundPort.postMessage({
      type: 'inject',
      tabId: browser.devtools.inspectedWindow.tabId
    })
    connect()

  } else {
    console.log('received an unknown message type', event)
  }
}