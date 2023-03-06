import browser from 'webextension-polyfill'

export type Connection = {
  tabId: number;
  connected: boolean
}

type Connections = {
  [ tabId: string ]: { connected: boolean }
}

export async function get(tabId: number): Promise<Connection | null> {
  // Load connections and attempt to get the connection
  const store: Connections = await browser.storage.local.get('connections')
  let storedConnection

  console.log('store in get', store)

  if (store && store.connections) {
    storedConnection = store.connections[ `${tabId}` ]

    console.log('loading connections in get', store.connections)
    console.log('connection in get', storedConnection)
  }

  return storedConnection ? { tabId, connected: storedConnection.connected } : null
}

export async function update(connection: Connection) {
  const { tabId, connected } = connection

  console.log('Updating storage with connection', connection)

  // Load existing connections from storage
  const store = await browser.storage.local.get('connections')
  console.log('stored connections in update', store)

  // If connections are undefined, start with an empty object
  if (!store.connections) store[ 'connections' ] = {}

  // Add or update the connection to the connections object
  store.connections[ `${tabId}` ] = { connected }
  console.log('storing connections as', store)

  // Store it
  browser.storage.local.set({ connections: store.connections })
    .catch(err => console.error('Browser storage error:', err))

  // const obj = {}
  // obj[ 'connections' ] = undefined
  // await browser.storage.local.set(obj)
  const updatedConnections = await browser.storage.local.get('connections')

  console.log('Updated connections', updatedConnections)
}

export async function remove(tabId: number): Promise<void> {
  const store: Connections = await browser.storage.local.get('connections')
  console.log('store in get', store)

  console.log('connections before removing', store.conenctions)

  // Remove connection
  store.connections[ `${tabId}` ] = undefined

  // Store conenctions
  browser.storage.local.set({ connections: store.connections })
    .catch(err => console.error('Browser storage error:', err))

}

export async function sweep() {
  // Load connections

  // Query tabs and get an array of tab ids

  // Remove any stored connections that do not have a corresponding tab
  return

}
