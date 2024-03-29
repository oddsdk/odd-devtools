if (!window.oddMessageHandlerInjected) {
  window.oddMessageHandlerInjected = true

  window.addEventListener('message', (event) => {
    // Reject messages not from ourselves
    if (event.source !== window) return

    if (event.data.id === chrome.runtime.id) {
      chrome.runtime.sendMessage(event.data)
    }
  })
}