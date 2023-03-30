import type { AppInfo } from '../namespace'

export type Message = {
  type: 'session' | 'fileSystem'
  timestamp: number
  state: State
  detail: Detail
}

type State = {
  app: {
    version: string
    namespace: AppInfo | string
    capabilities?: Permissions
  }
  fileSystem: {
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

export function label(message: Message): string {
  let label

  switch (message.type) {
    case 'fileSystem':
      if (message.detail.type === 'local-change') {
        label = 'Local Change'
      } else {
        label = 'Publish'
      }
      break

    case 'session':
      if (message.detail.type === 'create') {
        label = 'Session Create'
      } else {
        label = 'Session Destroy'
      }
  }

  return label
}

export function hasMatchingTerm(collection: object | [], term: string): boolean {
  const vals = Array.isArray(collection)
    ? collection
    : Object.values(collection)

  return vals.some(val => {
    if (typeof val === 'string') {
      return val.includes(term)
    } else if (typeof val === 'number' || val === null) {
      return String(val).includes(term)
    } else if (typeof val === 'object' || Array.isArray(val)) {
      return hasMatchingTerm(val, term)
    } else {
      return false
    }
  })
}