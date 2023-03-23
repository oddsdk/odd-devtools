import type { AppInfo } from '../namespace'

export type Message = {
  type: 'session' | 'filesystem'
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

export function label(message: Message): string {
  let label

  switch (message.type) {
    case 'filesystem':
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