import type { } from '@nuxt/types'
import type { UserConfig } from 'vite'

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
