import type { Plugin } from 'vite'
import { resolve } from 'upath'
import { mkdirp } from 'fs-extra'

export function cacheDirPlugin (rootDir, name: string) {
  const optimizeCacheDir = resolve(rootDir, 'node_modules', '.cache/vite', name)
  return <Plugin> {
    name: 'nuxt:workaround-cache-dir',
    async configResolved (resolvedConfig) {
      // @ts-ignore
      resolvedConfig.optimizeCacheDir = optimizeCacheDir
      await mkdirp(resolve(optimizeCacheDir, 'temp'))
    }
  }
}
