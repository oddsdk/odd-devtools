chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'pageload' })

console.log('*** In page load content script')
console.log('window.__webnative', window.__webnative)
// console.log('window.__webnative', window.__webnative)

setTimeout(() => console.log('window.__webnative', window.__webnative), 500)

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('window loaded')
//   chrome.runtime.sendMessage({ id: `${chrome.runtime.id}`, type: 'pageload' })
// })