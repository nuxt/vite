import type { Plugin } from 'vite'
import { resolve } from 'upath'
import { mkdirpSync } from 'fs-extra'

export function cacheDirPlugin (rootDir, name: string) {
  const optimizeCacheDir = resolve(rootDir, 'node_modules', '.cache/vite', name)
  mkdirpSync(resolve(optimizeCacheDir, 'temp'))
  return <Plugin> {
    name: 'nuxt:workaround-cache-dir',
    configResolved (resolvedConfig) {
      // @ts-ignore
      resolvedConfig.optimizeCacheDir = optimizeCacheDir
    }
  }
}
