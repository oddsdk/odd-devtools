import browser from 'webextension-polyfill'
import { writable } from 'svelte/store'

import Panel from '/src/devtools/Panel.svelte'

// STORES

const tabId = browser.devtools.inspectedWindow.tabId

export const connectionStore = writable({ tabId, connected: false, error: null })
export const messageStore = writable([])
export const namespaceStore = writable([])
export const searchTermStore = writable('')
export const selectedMessageStore = writable(null)

export let clearMessages

function initializeStores(data) {
  connectionStore.set(data.connection)
  messageStore.set(data.messages)
  namespaceStore.set(data.namespaces)

  clearMessages = data.clearMessages
}

function updateConnection(connection) {
  connectionStore.set(connection)
}

function updateMessages(messages) {
  messageStore.set(messages)
}

function updateNamespaces(messages) {
  namespaceStore.set(messages)
}

// Stores are synced with store state in devtools.js
window.initializeStores = initializeStores
window.updateConnection = updateConnection
window.updateMessages = updateMessages
window.updateNamespaces = updateNamespaces


// RENDER PANEL

const target = document.getElementById('app')

function render() {
  new Panel({ target })
}

document.addEventListener('DOMContentLoaded', render)
