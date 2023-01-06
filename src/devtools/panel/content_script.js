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

// window.postMessage(message, target);

// myPort.postMessage({type: 'info', type: tt})



// console.log(browser.runtime)

// function handleMessage(message) {
//   console.log('content script>', [].slice.call(arguments));
// }

// browser.runtime.onMessage(handleMessage)

// browser.runtime.sendMessage('this is content_script.js!');

// function getUserInfo() {
//   let userInfo = {
//     username: false
//   }

//   console.log('getUserInfo>', typeof navigator.__wn, navigator.__wn)

//   return new Promise((resolve, reject) => {
//     navigator.__wn.authenticatedUsername().then((result) => {
//       userInfo.username = result
//       resolve(userInfo)
//     })
//   })
// }

// function getWebNativeInfo() {
//   let result = {};
//   if (isWebNativeLoaded() === true) {
//     result = {
//       enabled: true
//     }
//   }
//   else {
//     result = {
//       enabled: false
//     }
//   }

//   return new Promise((resolve, reject) => {
//     getUserInfo().then((userInfo) => {

//       result.userInfo = userInfo;
//       resolve(result)
//     })
//     .catch((err) => {
//       reject(err)
//     })
//   })
// }

// function isWebNativeLoaded() {
//   return !(typeof navigator.__wn === 'undefined');
// }

// /**
//  * 
//  */

// let myPort;

// if (typeof myPort === 'undefined') { 
//   console.log('1 - got here')
//   myPort = browser.runtime.connect({name:"port-from-cs"});

//   console.log('myPort', myPort);
  
//   myPort.onMessage.addListener(function(message) {
//     console.log("In content script, received message from background script: ", message);

//     if (message.command === 'info') {
//       getWebNativeInfo()
//         .then((userInfo) => {
//           myPort.postMessage(info)
//         })
//         .catch((err) => {
//           myPort.postMessage({
//             error: err
//           });
//           throw err;
//         })
//     }
//     else {
//       myPort.postMessage({type: 'unknown message', message})
//     }
//   })
// }; // squash errors from re-loading the content script multiple times

// console.log('the content script is alive');

// myPort.postMessage({type: 'info', data: [1, 2, 3, 4]});
