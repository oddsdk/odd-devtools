window.addEventListener('message', (event) => {
  // Reject messages not from ourselves
  if (event.source !== window) return

  if (event.data.id === 'webnative-devtools-ready-message') {
    // console.log('in page load content script, got message', event.data)

    chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'pageload' })
  }
})