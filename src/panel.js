let port = browser.runtime.connect({name: 'devtools-panel'});

// let injected = false; // intialize

console.log(`panel.js tabId: ${browser.devtools.inspectedWindow.tabId}`)


/**
 * Inject the content script.
 */
function init() {
  console.log(`Called init`)
  port.postMessage({
    type: 'inject', 
    script: 'content_script.js',
    tabId: browser.devtools.inspectedWindow.tabId
  });
}

document.querySelector('#start-btn').addEventListener('click', (ev) => {
  console.log(`Logged start`)
  port.postMessage({
    type: 'counter',
    event: 'start'
  })
})

document.querySelector('#stop-btn').addEventListener('click', (ev) => {
  console.log(`Logged stop`)
  port.postMessage({
    type: 'counter',
    event: 'stop'
  })
})

document.querySelector('#reset-btn').addEventListener('click', (ev) => {
  console.log(`Logged reset`)
  port.postMessage({
    type: 'counter',
    event: 'reset'
  })
})

port.onMessage.addListener((event) => {
  // console.log('panel port onMessage', event)
  if (event.type === 'counter') {
    if (event.event === 'start') {
      document.querySelector('#status').textContent = 'Started'
    }
    else if (event.event === 'update') {
      document.querySelector('#count').textContent = event.count
    }
    else if (event.event === 'stop') {
      document.querySelector('#status').textContent = 'Stopped'
    }
    else if (event.event === 'reset') {
      document.querySelector('#count').textContent = event.count
    }
  } else if (event.type === 'mouse-tracking') {
    document.querySelector('#mouse-x').textContent = event.x;
    document.querySelector('#mouse-y').textContent = event.y;
  }
})


/**
 * Mouse position tracking - we inject a script that listens for mouse x/y 
 * position on the window and then pipes the data back through the extension 
 * so be displayed in the devtools panel.
 */

function startMouseTracking() {

  // utility function.
  let script1 = `(function() {
    function handleMouseMove(event) {
      var eventDoc, doc, body;

      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
      }

      // Use event.pageX / event.pageY here

      // console.log(event.pageX, event.pageY)

      let data = JSON.parse(JSON.stringify({
        type: 'mouse-tracking', 
        x: event.pageX,
        y: event.pageY
      }));

      window.postMessage(data)
    }
    document.onmousemove = handleMouseMove
  })();`

  // script to stop the event from happening.
  browser.devtools.inspectedWindow.eval(script1)
  return true
}

let tracking = false;

function stopMouseTracking() {
  let script2 = `(function() {
    document.onmousemove = null;
  })();`;

  browser.devtools.inspectedWindow.eval(script2)
  return false;
}


document.querySelector('#tracking-control').addEventListener('click', (ev) => {
  // console.log(`tracking control`)
  if (document.querySelector('#tracking-control').textContent === 'Start tracking') {
    tracking = startMouseTracking()
    document.querySelector('#tracking-control').textContent = 'Stop tracking';
  }
  else {
    tracking = stopMouseTracking()
    document.querySelector('#tracking-control').textContent = 'Start tracking';
    document.querySelector('#mouse-x').textContent = 0;
    document.querySelector('#mouse-y').textContent = 0;    
  }
})



