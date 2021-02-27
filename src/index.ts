import type { } from '@nuxt/types'
import type { UserConfig } from 'vite'
import { resolve } from 'upath'
import semver from 'semver'

export default function () {
  const { nuxt } = this

  if (!nuxt.options.dev) {
    return
  }

  // Check nuxt version
  const minVersion = '2.15.2'
  const currentVersion = nuxt.constructor.version || '0.0.0'
  if (semver.lt(nuxt.constructor.version, minVersion)) {
    // eslint-disable-next-line no-console
    console.warn(`disabling nuxt-vite since nuxt >= ${minVersion} is required (curret version: ${currentVersion})`)
    return
  }

  nuxt.options.cli.badgeMessages.push('⚡ Vite Mode Enabled')
  // eslint-disable-next-line no-console
  console.log(
    '🧪  Vite mode is experimental and many nuxt modules are still incompatible\n',
    '   If found a bug, please report via https://github.com/nuxt/vite/issues with a minimal reproduction'
  )

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
