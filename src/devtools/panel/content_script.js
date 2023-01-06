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

addEventListener('message', (event) => {

  if (event.data.command === 'current_user') {
    console.log('message in cs', event)
    myPort.postMessage(event.data)
  }
})

