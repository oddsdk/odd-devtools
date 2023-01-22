/**
 */

export function logInPage(message, level) {
  let levels = ['log', 'warn', 'error', 'info']

  if (!levels.includes(level)) {
    console.warn(`Invalid level supplied: ${level}, needs to be one of ${levels.join(',')}`)
    level = 'log' // default log level
  }

  browser.devtools.inspectedWindow.eval(
    `console.${level}('Extension>', ${message})`,
    function (result, isException) {
      if (isException) {
        console.error(`Exception thrown trying to log to the page: ${result}`)
      }
    }
  )
}