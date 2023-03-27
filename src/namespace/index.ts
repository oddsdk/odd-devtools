export type AppInfo = {
  name: string
  creator: string
}

export function namespaceToString(namespace: AppInfo | string): string {
  return typeof namespace === 'string' ?
    namespace :
    `${namespace.creator}/${namespace.name}`
}

export const allNamespace = { namespace: 'All namespaces', version: null }