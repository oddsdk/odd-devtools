console.log('this is content_script.js!')

myPort = browser.runtime.connect({name:"port-from-cs"})

// let wn = window.wrappedJSObject.navigator.__wn;

myPort.onMessage.addListener((message) => {
  console.log('message from background>', message);

  // if (message)

  if (message.command === 'ping page') {
    window.postMessage(message, target)
  }
})

let target = document.location.href;
let message = {msg: 'message from content script'};

window.addEventListener('message', (event) => {
  console.log('in cs, got message', event)
  myPort.postMessage(event)
})

