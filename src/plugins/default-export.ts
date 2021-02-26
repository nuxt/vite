import type { Plugin } from 'vite'

export function defaultExportPlugin (getIds: () => string[]) {
  return <Plugin>{
    name: 'default-export-plugin',
    transform (code, id) {
      if (getIds().includes(id) || id.startsWith('nuxt_plugin_')) {
        if (!code.includes('export default')) {
          return {
            map: null,
            code: code + '\n\n' + 'export default () => {}'
          }
        }
      }
      return null
    }
  }
}
