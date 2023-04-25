// Emit load on script injection
chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'pageload' })

window.addEventListener('pageshow', () => {
  chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'pageload' })
})

window.addEventListener('message', (event) => {
  // Reject messages not from ourselves
  if (event.source !== window) return

  if (event.data.id === 'odd-devtools-ready-message') {
    chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'ready' })
  }
})