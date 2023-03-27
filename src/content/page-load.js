chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'pageload' })

window.addEventListener('message', (event) => {
  // Reject messages not from ourselves
  if (event.source !== window) return

  if (event.data.id === 'webnative-devtools-ready-message') {
    chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'ready' })
  }
})