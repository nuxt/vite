import { resolve } from 'path'
import { mkdirp } from 'fs-extra'
import consola from 'consola'
import * as vite from 'vite'
import { buildClient } from './client'
import { buildServer } from './server'

export interface Nuxt {
  options: any
  hook: Function
  callHook: Function
}

export interface ViteBuildContext {
  nuxt: Nuxt
  config: vite.InlineConfig
}

async function bundle (nuxt: Nuxt) {
  const ctx: ViteBuildContext = {
    nuxt,
    config: {
      root: nuxt.options.buildDir,
      mode: nuxt.options.dev ? 'development' : 'production',
      logLevel: 'warn',
      define: {
        __webpack_public_path__: 'globalThis.__webpack_public_path__'
      },
      resolve: {
        extensions: ['.ts', '.js', '.json', '.mjs', '.vue'],
        alias: {
          '~': nuxt.options.srcDir,
          '@': nuxt.options.srcDir
        }
      },
      clearScreen: false,
      build: {
        emptyOutDir: false
      }
    }
  }

  await mkdirp(resolve(nuxt.options.buildDir, '.vite/temp'))

  const callBuild = async (fn, name) => {
    try {
      const start = Date.now()
      await fn(ctx)
      const time = (Date.now() - start) / 1000
      consola.success(`${name} compiled successfully in ${time}s`)
    } catch (err) {
      consola.error(`${name} compiled with errors:`, err)
    }
  }

  if (nuxt.options.dev) {
    await Promise.all([
      callBuild(buildClient, 'Client'),
      callBuild(buildServer, 'Server')
    ])
  } else {
    await callBuild(buildClient, 'Client')
    await callBuild(buildServer, 'Server')
  }
}

export class ViteBuilder {
  builder: any
  nuxt: Nuxt

  constructor (builder: any) {
    this.builder = builder
    this.nuxt = builder.nuxt
  }

  build () {
    return bundle(this.nuxt)
  }
}
