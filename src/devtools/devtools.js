import { get as getStore, writable } from 'svelte/store'
import browser from 'webextension-polyfill'

import { allNamespace, namespaceToString } from '../namespace'

console.log(`In devtools.js - tabId: ${browser.devtools.inspectedWindow.tabId}`)

const tabId = browser.devtools.inspectedWindow.tabId

// INIT 

// Connect with the background script
let backgroundPort = browser.runtime.connect({ name: 'devtools-page' })
backgroundPort.onMessage.addListener(handleBackgroundMessage)

// Create a panel
browser.devtools.panels.create(
  'Webnative',
  '/webnative16.png',
  '/src/devtools/panel.html'
).then(panel => {
  let unsubscribeConnectionStore
  let unsubscribeMessageStore
  let unsubscribeNamespaceStore

  panel.onShown.addListener(panelWindow => {
    panelWindow.initializeStores({
      connection: getStore(connectionStore),
      messages: getStore(messageStore),
      namespaces: getStore(namespaceStore),

      clearMessages: (namespace) => {
        if (namespace === allNamespace.namespace) {
          messageStore.set([])
        } else {
          messageStore.update(messages =>
            messages.filter(message => namespaceToString(message.state.app.namespace) !== namespace)
          )
        }
      }
    })

    unsubscribeConnectionStore = connectionStore.subscribe(store => {
      panelWindow.updateConnection(store)
    })

    unsubscribeMessageStore = messageStore.subscribe(store => {
      panelWindow.updateMessages(store)
    })

    unsubscribeNamespaceStore = namespaceStore.subscribe(store => {
      panelWindow.updateNamespaces(store)
    })
  })

  panel.onHidden.addListener(() => {
    unsubscribeConnectionStore()
    unsubscribeMessageStore()
    unsubscribeNamespaceStore()
  })
})


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

export const connectionStore = writable({ tabId, connected: false, error: null })

export async function connect() {
  console.log('connecting to Webnative')

  const [connecting, err] = await browser.devtools.inspectedWindow.eval(`
    if (window.__odd?.extension) {
      window.__odd.extension.connect('${chrome.runtime.id}')
      true
    } else {
      false
    }`
  )

  if (!connecting) {
    connectionStore.update(store => ({ ...store, error: 'DebugModeOff' }))
  } else if (err) {
    connectionStore.update(store => ({ ...store, error: 'EvalFailed' }))
    console.error('Inspected window eval error: ', err)
  }
}

export async function disconnect() {
  console.log('disconnecting from Webnative')

  const [disconnecting, err] = await browser.devtools.inspectedWindow.eval(`
    if (window.__odd?.extension) {
      window.__odd.extension.disconnect('${chrome.runtime.id}')
      true
    } else {
      false
    }`
  )

  if (!disconnecting) {
    connectionStore.update(store => ({ ...store, error: 'DebugModeOff' }))
  } else if (err) {
    connectionStore.update(store => ({ ...store, error: 'EvalFailed' }))
    console.error('Inspected window eval error: ', err)
  }
}


// MESSAGES

export const messageStore = writable([])
export const namespaceStore = writable([])

function handleBackgroundMessage(message) {
  // console.log('devtools port onMessage', message)

  if (message.type === 'connect') {
    console.log('received connect message from Webnative', message)

    const namespace = {
      namespace: namespaceToString(message.state.app.namespace),
      version: message.state.odd.version
    }
    namespaceStore.update(store =>
      [...store.filter(ns => ns.namespace !== namespaceToString(message.state.app.namespace)), namespace]
    )

    connectionStore.update(store => ({ ...store, connected: true }))
  } else if (message.type === 'disconnect') {
    console.log('received disconnect message from Webnative', message)

    connectionStore.update(store => ({ ...store, connected: false }))
  } else if (message.type === 'session') {
    console.log('received session message', message)

    messageStore.update(history => [...history, message])
  } else if (message.type === 'fileSystem') {
    console.log('received file system message', message)

    messageStore.update(history => [...history, message])
  } else if (message.type === 'pageload') {
    console.log('received page load message', message)

    connectionStore.update(store => ({ ...store, connected: false }))
  } else if (message.type === 'ready') {
    console.log('received ready message', message)

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