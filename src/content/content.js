console.log('this is content_script.js!')

const extensionPort = browser.runtime.connect({name:"content-script"})

// let wn = window.wrappedJSObject.navigator.__wn;

let loop, count = 0;

function startCounter() {
  
  loop = setInterval(() => {
    count++
    extensionPort.postMessage({
      type: 'counter',
      event: 'update',
      count: count
    })
  }, 2000);
  extensionPort.postMessage({
    type: 'counter',
    event: 'start'
  });
}

function stopCounter() {
  clearInterval(loop)
  extensionPort.postMessage({
    type: 'counter',
    event: 'stop',
    count: count
  })
}

function resetCounter() {
  count = 0
  extensionPort.postMessage({
    type: 'counter',
    event: 'reset',
    count: count
  })
}

extensionPort.onMessage.addListener((ev) => {
  console.log('event from background>', ev);

  if (ev.type === 'counter') {
    if (ev.event === 'start') {
      startCounter()
    }
    else if (ev.event === 'stop') {
      stopCounter();
    }
    else if (ev.event === 'reset') {
      resetCounter()
    }
  }
})

window.addEventListener('message', (event) => {
  // console.log('in cs, got message', event)
  extensionPort.postMessage(event.data)
})
