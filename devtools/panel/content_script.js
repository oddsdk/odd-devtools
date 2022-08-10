// console.log('this is content_script.js!');

// console.log(browser.runtime)

// function handleMessage(message) {
//   console.log('content script>', [].slice.call(arguments));
// }

// browser.runtime.onMessage(handleMessage)

// browser.runtime.sendMessage('this is content_script.js!');

function getWebNativeInfo() {

}

function isWebNativeLoaded() {
  
}

/**
 * 
 */

if (typeof(myPort) === 'undefined') { 
  let myPort = browser.runtime.connect({name:"port-from-cs"});
  myPort.postMessage({greeting: "hello from content script"});
  
  myPort.onMessage.addListener(function(m) {
    console.log("In content script, received message from background script: ");
    console.log(m.greeting);
  });  
}; // squash errors from re-loading the content script multiple times
