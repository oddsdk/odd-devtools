console.log('this is content.js!')


window.addEventListener('message', (event) => {
  // Reject messages not from ourselves
  if (event.source !== window) return

  if (event.data.id === chrome.runtime.id) {
    // console.log('in content script, got message', event.data)

    chrome.runtime.sendMessage(event.data)
  }
})