import browser from 'webextension-polyfill'
import { writable } from 'svelte/store'

import Panel from '/src/devtools/Panel.svelte'

// STORES

const tabId = browser.devtools.inspectedWindow.tabId

export const connection = writable({ tabId, connected: false, error: null })

export const eventStore = writable([])

function initializeStores(event) {
  connection.set(event.connection)
  eventStore.set(event.events)
}

function updateConnection(event) {
  connection.set(event)
}

function updateEvents(event) {
  eventStore.set(event)
}

// Stores are synced with store state in devtools.js
window.initializeStores = initializeStores
window.updateConnection = updateConnection
window.updateEvents = updateEvents


// RENDER PANEL

const target = document.getElementById('app')

function render() {
  new Panel({ target })
}

document.addEventListener('DOMContentLoaded', render)
