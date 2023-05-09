import type { AppInfo } from '../namespace'

export type Message = {
  type: 'session' | 'fileSystem'
  timestamp: number
  state: State
  detail: Detail
}

type State = {
  app: {
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
  odd: {
    version: string
  }
}

type Detail =
  { type: 'create', username: string } |
  { type: 'destroy', username: string } |
  { type: 'local-change', root: string, path: object } |
  { type: 'publish', root: string }


interface FileSystemDetail {
  root: string
}

function isFileSystemDetail(detail: unknown): detail is FileSystemDetail {
  return (
    detail !== null &&
    typeof detail === 'object' &&
    typeof detail['root'] === 'string'
  )
}


// DISPLAY

export type DisplayMessage = {
  detail: { timestamp: number } &
  { type: 'create', username: string } |
  { type: 'destroy', username: string } |
  { type: 'local-change', localRootCID: string, path: object } |
  { type: 'publish', localRootCID: string }
  user: State[ 'user' ]
  fileSystem: { publishedRootCID: string }
}

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

export function getDisplayMessage(message: Message): DisplayMessage {
  if (!message) return

  let detail

  if (isFileSystemDetail(message.detail)) {
    detail = {
      timestamp: message.timestamp,
      localRootCID: message.detail.root
    }

    if (message.detail.type === 'local-change') {
      detail['path'] = message.detail.path
    }
  } else {
    detail = {
      timestamp: message.timestamp,
      username: message.detail.username
    }
  }

  return {
    detail,
    user: message.state.user,
    fileSystem: {
      publishedRootCID: message.state.fileSystem.dataRootCID
    }
  }
}


// FILTERING

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