import { get as getStore, writable } from 'svelte/store'
import browser from 'webextension-polyfill'

import * as messageStorage from '../storage/message'
import { namespaceToString } from '../message'

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
    connection.update(store => ({ ...store, error: 'DebugModeOff' }))
  } else if (err) {
    connection.update(store => ({ ...store, error: 'EvalFailed' }))
    console.error('Inspected window eval error: ', err)
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
    connection.update(store => ({ ...store, error: 'DebugModeOff' }))
  } else if (err) {
    connection.update(store => ({ ...store, error: 'EvalFailed' }))
    console.error('Inspected window eval error: ', err)
  }
}


// MESSAGES

export const messageStore = writable([])
export const namespaceStore = writable([])


function handleBackgroundMessage(message) {
  if (message.type === 'connect') {
    console.log('received connect message from Webnative', message)

    const namespace = message.state.app.namespace

    // Add namespace for connected app
    // namespaceStore.update(store =>
    //   store.filter(ns => namespaceToString(ns) !== namespaceToString(namespace)).concat(namespace)
    // )

    messageStorage.get(namespace).then(messages => {

      // Add namespace if messages
      if (messages.length > 0) {
        namespaceStore.update(store =>
          store
            .filter(ns => namespaceToString(ns) !== namespaceToString(namespace))
            .concat(namespace)
        )
      }

      // Add and sort messages
      messageStore.update(store =>
        store
          .filter(message => namespaceToString(message.state.app.namespace) !== namespaceToString(namespace))
          .concat(messages)
          .sort((a, b) => a.timestamp - b.timestamp)
      )
    })

    connection.update(store => ({ ...store, connected: true }))
  } else if (message.type === 'disconnect') {
    console.log('received disconnect message from Webnative', message)

    connection.update(store => ({ ...store, connected: false }))
  } else if (message.type === 'session') {
    console.log('received session message', message)

    messageStore.update(history => [...history, message])

    const namespace = namespaceToString(message.state.app.namespace)
    namespaceStore.update(store => store.filter(ns => namespaceToString(ns) !== namespaceToString(namespace)).concat(namespace))

    const associatedMessages = getStore(messageStore).filter(m => namespaceToString(m.state.app.namespace) === namespace)
    messageStorage.set(namespace, associatedMessages)
  } else if (message.type === 'filesystem') {
    console.log('received filesystem message', message)

    messageStore.update(history => [...history, message])

    const namespace = namespaceToString(message.state.app.namespace)
    namespaceStore.update(store => store.filter(ns => namespaceToString(ns) !== namespaceToString(namespace)).concat(namespace))

    const associatedMessages = getStore(messageStore).filter(m => namespaceToString(m.state.app.namespace) === namespace)
    messageStorage.set(namespace, associatedMessages)
  } else if (message.type === 'pageload') {
    console.log('received page load message', message)

    // Inject content script if missing
    backgroundPort.postMessage({
      type: 'inject',
      tabId: browser.devtools.inspectedWindow.tabId
    })
    connect()

  } else {
    console.log('received an unknown message type', message)
  }
}