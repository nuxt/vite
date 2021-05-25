import type { } from '@nuxt/types'
import { resolve } from 'upath'
import consola from 'consola'
import { lt } from 'semver'
import { name, version } from '../package.json'
import type { ViteOptions } from './types'

function nuxtVite () {
  const { nuxt } = this

  if (!nuxt.options.dev) {
    return
  }

  // Check nuxt version
  const minVersion = '2.15.2'
  const currentVersion = nuxt.constructor.version || '0.0.0'
  if (lt(nuxt.constructor.version, minVersion)) {
    // eslint-disable-next-line no-console
    consola.warn(`disabling nuxt-vite since nuxt >= ${minVersion} is required (curret version: ${currentVersion})`)
    return
  }

  // Disable SSR by default
  const ssrEnabled = nuxt.options.ssr && nuxt.options.vite?.ssr
  if (!ssrEnabled) {
    nuxt.options.ssr = false
    nuxt.options.render.ssr = false
    nuxt.options.build.ssr = false
    nuxt.options.mode = 'spa'
  }

  nuxt.options.cli.badgeMessages.push(`⚡  Vite Mode Enabled (v${version})`)
  // eslint-disable-next-line no-console
  if (nuxt.options.vite?.experimentWarning !== false && !nuxt.options.test) {
    consola.log(
      '🧪  Vite mode is experimental and some nuxt modules might be incompatible\n',
      '   If found a bug, please report via https://github.com/nuxt/vite/issues with a minimal reproduction.' + (
        ssrEnabled
          ? '\n    Unstable server-side rendering is enabled'
          : '\n    You can enable unstable server-side rendering using `vite: { ssr: true }` in `nuxt.config`'
      )
    )
  }

  // Disable loading-screen because why have it!
  nuxt.options.build.loadingScreen = false
  nuxt.options.build.indicator = false
  nuxt.options._modules = nuxt.options._modules
    .filter(m => !(Array.isArray(m) && m[0] === '@nuxt/loading-screen'))

  // Mask nuxt-vite  to avoid other modules depending on it's existence
  // TODO: Move to kit
  const getModuleName = (m) => {
    if (Array.isArray(m)) { m = m[0] }
    return m.meta ? m.meta.name : m
  }
  const filterModule = modules => modules.filter(m => getModuleName(m) !== 'nuxt-vite')
  nuxt.options.modules = filterModule(nuxt.options.modules)
  nuxt.options.buildModules = filterModule(nuxt.options.buildModules)

  if (nuxt.options.store) {
    this.addTemplate({
      src: resolve(__dirname, './runtime/templates', 'store.mjs'),
      fileName: 'store.js'
    })
  }
  this.addTemplate({
    src: resolve(__dirname, './runtime/templates', 'middleware.mjs'),
    fileName: 'middleware.js'
  })

  nuxt.hook('builder:prepared', async (builder) => {
    builder.bundleBuilder.close()
    delete builder.bundleBuilder
    const { ViteBuilder } = await import('./vite')
    builder.bundleBuilder = new ViteBuilder(builder)
  })
}

nuxtVite.meta = { name, version }
export default nuxtVite

declare module '@nuxt/types/config/index' {
  interface NuxtOptions {
    /**
     * Configuration for Vite.
     * Severe the same functionality as Vite's `vite.config.ts`.
     * It will merges with Nuxt specify configurations and plugins.
     *
     * @link https://vitejs.dev/config/
     */
    vite?: ViteOptions & {
      ssr: false | ViteOptions['ssr'],
      experimentWarning: boolean
    }
  }
}
