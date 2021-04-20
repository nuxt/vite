import type { Plugin } from 'vite'

export function replace (replacements: Record<string, string>) {
  return <Plugin>{
    name: 'nuxt:replace',
    transform (code) {
      Object.entries(replacements).forEach(([key, value]) => {
        code = code.replace(new RegExp(key, 'g'), value)
      })
      return {
        code,
        map: null
      }
    }
  }
}
