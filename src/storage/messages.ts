import browser from 'webextension-polyfill'

type Messages = {
  [ namespace: string ]: Message[]
}

type Message = {
  type: 'session' | 'filesystem'
  state: State
  detail: Detail
}

type State = {
  app: {
    version: string
    namespace: AppInfo | string
    capabilities?: Permissions
  }
  filesystem: {
    dataRootCID: string | null
  }
  user: {
    username: string | null
    accountDID: string | null
    agentDID: string
  }
}

type Detail =
  { type: 'create', username: string } |
  { type: 'destroy', username: string } |
  { type: 'local-change', root: string, path: object } |
  { type: 'publish', root: string }

type AppInfo = {
  name: string
  creator: string
}


export async function get(namespace: AppInfo | string): Promise<Message[]> {
  const ns = namespaceToString(namespace)

  const store: Messages = await browser.storage.local.get('messages')
  let storedMessages

  if (store && store.messages) {
    storedMessages = store.messages[ `${ns}` ]

    console.log('messages in get', storedMessages)
  }

  return storedMessages ?? []
}


export async function set(namespace: AppInfo | string, messages: Message[]) {
  const ns = namespaceToString(namespace)

  // Load all messages from storage
  const store = await browser.storage.local.get('messages')

  // If connections are undefined, start with an empty object
  if (!store.messages) store.messages = {}

  // Add or update the connection to the connections object
  store.messages[ `${ns}` ] = messages

  console.log('storing connections as', store)

  // Store it
  browser.storage.local.set({ messages: store.messages })
    .catch(err => console.error('Browser storage error:', err))

  // const updatedMessages = await browser.storage.local.get('messages')

  // console.log('Updated messages', updatedMessages)
}


export async function clear(namespace: AppInfo | string): Promise<void> {
  const ns = namespaceToString(namespace)

  // Load all messages from storage
  const store = await browser.storage.local.get('messages')

  // Nothing to do if no messsages
  if (!store.messages) return

  store.messages[ `${ns}` ] = []

  browser.storage.local.set({ messages: store.messages })
    .catch(err => console.error('Browser storage error:', err))
}


export function namespaceToString(namespace: AppInfo | string): string {
  return typeof namespace === 'string' ?
    namespace :
    `${namespace.creator}/${namespace.name}`
}