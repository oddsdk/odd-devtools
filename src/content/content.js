console.log('this is content.js!')

// let wn = window.wrappedJSObject.navigator.__wn;

window.addEventListener('message', (event) => {
  // Reject messages not from ourselves
  if (event.source !== window) return

  console.log('in cs, got message', event)

  chrome.runtime.sendMessage(event.data)
})