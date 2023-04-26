import { get as getStore, writable } from 'svelte/store'
import browser from 'webextension-polyfill'

import { allNamespace, namespaceToString } from '../namespace'

const tabId = browser.devtools.inspectedWindow.tabId

// INIT 

// Connect with the background script
let backgroundPort = browser.runtime.connect({ name: `odd_devtools-${tabId}` })
backgroundPort.onMessage.addListener(handleBackgroundMessage)

// Create a panel
browser.devtools.panels.create(
  'ODD SDK',
  '/odd48.png',
  '/src/devtools/panel.html'
).then(panel => {
  let unsubscribeConnectionStore
  let unsubscribeMessageStore
  let unsubscribeNamespaceStore

  panel.onShown.addListener(panelWindow => {

    /**
     * on Chrome, themeName can be one of ( default, dark )
     * on Firefox, themeName can be one of ( light, dark )
     */
    panelWindow.setTheme(browser.devtools.panels.themeName)

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

// Connect with ODD SDK
connect()


// BACKGROUND

/**
 * Rewire connection with the background script on message
 */
function handleBackgroundConnection(port) {
  if (port.name === `odd_background-${tabId}`) {
    backgroundPort = port
    backgroundPort.onMessage.addListener(handleBackgroundMessage)
  }
}

chrome.runtime.onConnect.addListener(handleBackgroundConnection)


// ODD SDK CONNECTION

export const connectionStore = writable({ tabId, connected: false, error: null })

export async function connect() {
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
    console.error('Inspected window eval error: ', err)
    connectionStore.update(store => ({ ...store, error: `Could not connect: ${err}` }))
  } else {
    connectionStore.update(store => ({ ...store, error: null }))
  }
}

export async function disconnect() {
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
    console.error('Inspected window eval error: ', err)
    connectionStore.update(store => ({ ...store, error: `Could not connect: ${err}` }))
  } else {
    connectionStore.update(store => ({ ...store, error: null }))
  }
}


// MESSAGES

export const messageStore = writable([])
export const namespaceStore = writable([])

function handleBackgroundMessage(message) {
  if (message.type === 'connect') {
    const namespace = {
      namespace: namespaceToString(message.state.app.namespace),
      version: message.state.odd.version
    }
    namespaceStore.update(store =>
      [...store.filter(ns => ns.namespace !== namespaceToString(message.state.app.namespace)), namespace]
    )

    connectionStore.update(store => ({ ...store, connected: true }))
  } else if (message.type === 'disconnect') {
    connectionStore.update(store => ({ ...store, connected: false }))
  } else if (message.type === 'session') {
    messageStore.update(history => [...history, message])
  } else if (message.type === 'fileSystem') {
    messageStore.update(history => [...history, message])
  } else if (message.type === 'pageload') {
    connectionStore.update(store => ({ ...store, connected: false }))

    // Assume debug mode off if no connect message received
    setTimeout(() => {
      const connection = getStore(connectionStore)

      if (!connection.connected) {
        connectionStore.update(store => ({ ...store, error: 'DebugModeOff' }))
      }
    }, 1000)
  } else if (message.type === 'ready') {
    // Inject content script if missing
    backgroundPort.postMessage({
      type: 'inject',
      tabId: browser.devtools.inspectedWindow.tabId
    })

    connect()
  } else {
    console.warn('Received an unknown message type', message)
  }
}