import type { Plugin } from 'vite'
import { readFile } from 'fs-extra'
export const PREFIX = 'defaultexport:'

export function defaultExportPlugin () {
  const ids = new Set()

  return <Plugin>{
    name: 'nuxt:default-export',
    enforce: 'pre',
    async resolveId (id, importer, opts) {
      if (id.startsWith(PREFIX)) {
        const resolved = await this.resolve(id.substr(PREFIX.length), importer, opts)
        ids.add(resolved.id)
        return resolved
      }
    },
    async load (id) {
      if (ids.has(id)) {
        const code = await readFile(id)
        if (!code.includes('export default')) {
          return code + '\n\n' + 'export default () => {}'
        }
      }
      return null
    },
    transform (code, id) {
      if (ids.has(id)) {
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
