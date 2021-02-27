import type { } from '@nuxt/types'
import type { UserConfig } from 'vite'
import { resolve } from 'upath'

export default function () {
  const { nuxt } = this

  if (!nuxt.options.dev) {
    return
  }

  // Disable loading-screen because why have it!
  nuxt.options.build.loadingScreen = false
  nuxt.options.build.indicator = false
  nuxt.options._modules = nuxt.options._modules
    .filter(m => !(Array.isArray(m) && m[0] === '@nuxt/loading-screen'))

  this.addTemplate({
    src: resolve(__dirname, '../templates', 'store.js'),
    fileName: 'store.js'
  })

  nuxt.hook('builder:prepared', async (builder) => {
    builder.bundleBuilder.close()
    delete builder.bundleBuilder
    const { ViteBuilder } = await import('./vite')
    builder.bundleBuilder = new ViteBuilder(builder)
  })
}

declare module '@nuxt/types/config/index' {
  interface NuxtOptions {
    vite?: UserConfig
  }
}
