// chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'pageload' })

// console.log('*** In page load content script')
// console.log('window.__webnative', window.__webnative)
// // console.log('window.__webnative', window.__webnative)

// setTimeout(() => console.log('window.__webnative', window.__webnative), 500)

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('window loaded')
//   chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'pageload' })
// })

window.addEventListener('message', (event) => {
  // Reject messages not from ourselves
  if (event.source !== window) return

  if (event.data.id === 'webnative-devtools-ready-message') {
    console.log('in page load content script, got message', event.data)

    chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'pageload' })
  }
})