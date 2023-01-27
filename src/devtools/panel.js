import { writable } from 'svelte/store'
import browser from 'webextension-polyfill'

import Panel from '/src/devtools/Panel.svelte'


// INIT

let backgroundPort = browser.runtime.connect({ name: 'devtools-panel' })
backgroundPort.onMessage.addListener(handleBackgroundMessage)

console.log(`panel.js tabId: ${browser.devtools.inspectedWindow.tabId}`)

/**
 * Inject the content script.
 */
window.init = function init() {
  console.log('Called init')

  backgroundPort.postMessage({
    type: 'inject',
    tabId: browser.devtools.inspectedWindow.tabId
  })
}


// BACKGROUND

/**
 * Rewire connection with the background script. 
 */
function connectionListener(port) {
  console.log('connection in panel from ', port.name)

  if (port.name === 'background') {
    backgroundPort = port
    backgroundPort.onMessage.addListener(handleBackgroundMessage)
  }
}

chrome.runtime.onConnect.addListener(connectionListener)


// RENDER PANEL

const target = document.getElementById('app')

function render() {
  new Panel({ target })
}

document.addEventListener('DOMContentLoaded', render)


// MOUSE TRACKING

// Store state that is accesed by Panel component
export const mousePosition = writable({ x: 0, y: 0 })

function handleBackgroundMessage(event) {
  // console.log('panel port onMessage', event)
  if (event.type === 'mouse-tracking') {
    mousePosition.set({ x: event.x, y: event.y })
  }
}

/**
 * Mouse position tracking - we inject a script that listens for mouse x/y 
 * position on the window and then pipes the data back through the extension 
 * so be displayed in the devtools panel.
 */

export function startMouseTracking() {

  // utility function.
  let script1 = `(function() {
    function handleMouseMove(event) {
      var eventDoc, doc, body;

      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
      }

      // Use event.pageX / event.pageY here

      // console.log(event.pageX, event.pageY)

      let data = JSON.parse(JSON.stringify({
        id: '${chrome.runtime.id}',
        type: 'mouse-tracking', 
        x: event.pageX,
        y: event.pageY
      }));

      window.postMessage(data)
    }
    document.onmousemove = handleMouseMove

    // if (window.navigator.connectToWebnative) {
    //   window.navigator.connectToWebnative()
    // } else {
    //   console.log("connect to webanative not defined.")
    // }
  })();`

  // script to stop the event from happening.
  browser.devtools.inspectedWindow.eval(script1)
}

export function stopMouseTracking() {
  let script2 = `(function() {
    document.onmousemove = null;
  })();`

  browser.devtools.inspectedWindow.eval(script2)
}