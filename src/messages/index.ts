
export type Message = {
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

export type AppInfo = {
  name: string
  creator: string
}


export function namespaceToString(namespace: AppInfo | string): string {
  return typeof namespace === 'string' ?
    namespace :
    `${namespace.creator}/${namespace.name}`
}