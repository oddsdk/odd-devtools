console.log('this is content.js!')

// let wn = window.wrappedJSObject.navigator.__wn;

window.addEventListener('message', (event) => {
  // Reject messages not from ourselves
  if (event.source !== window) return

  if (event.data.id === chrome.runtime.id) {
    // console.log('in cs, got message', event.data)

    chrome.runtime.sendMessage(event.data)
  }
})