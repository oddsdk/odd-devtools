import browser from 'webextension-polyfill'
import { writable } from 'svelte/store'

import Panel from '/src/devtools/Panel.svelte'

// STORES

const tabId = browser.devtools.inspectedWindow.tabId

export const connection = writable({ tabId, connected: false, error: null })

export const messageStore = writable({ history: [], session: [] })
export const namespaceStore = writable([])

function initializeStores(event) {
  connection.set(event.connection)
  messageStore.set(event.messages)
  namespaceStore.set(event.namespaces)
}

function updateConnection(event) {
  connection.set(event)
}

function updateEvents(event) {
  messageStore.set(event)
}

function updateNamespaces(event) {
  namespaceStore.set(event)
}

// Stores are synced with store state in devtools.js
window.initializeStores = initializeStores
window.updateConnection = updateConnection
window.updateEvents = updateEvents
window.updateNamespaces = updateNamespaces


// RENDER PANEL

const target = document.getElementById('app')

function render() {
  new Panel({ target })
}

document.addEventListener('DOMContentLoaded', render)
