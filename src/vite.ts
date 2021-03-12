import { resolve } from 'path'
import * as vite from 'vite'
import { buildClient } from './client'
import { buildServer } from './server'
import { defaultExportPlugin } from './plugins/default-export'
import { jsxPlugin } from './plugins/jsx'
import { resolveCSSOptions } from './css'
import type { Nuxt, ViteBuildContext, ViteOptions } from './types'

async function bundle (nuxt: Nuxt, builder: any) {
  for (const p of builder.plugins) {
    p.src = nuxt.resolver.resolvePath(resolve(nuxt.options.buildDir, p.src))
  }

  const ctx: ViteBuildContext = {
    nuxt,
    builder,
    config: vite.mergeConfig(
      nuxt.options.vite || {},
      {
        root: nuxt.options.buildDir,
        mode: nuxt.options.dev ? 'development' : 'production',
        logLevel: 'warn',
        define: {
          __webpack_public_path__: 'globalThis.__webpack_public_path__'
        },
        resolve: {
          extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
          alias: {
            ...nuxt.options.alias,
            '~': nuxt.options.srcDir,
            '@': nuxt.options.srcDir,
            'web-streams-polyfill/ponyfill/es2018': require.resolve('./runtime/mock/web-streams-polyfill'),
            // Cannot destructure property 'AbortController' of ..
            'abort-controller': require.resolve('./runtime/mock/abort-controller')
          }
        },
        vue: {},
        css: resolveCSSOptions(nuxt),
        optimizeDeps: {
          exclude: [
            'ufo',
            'date-fns',
            'nanoid'
          ]
        },
        esbuild: {
          jsxFactory: 'h',
          jsxFragment: 'Fragment'
        },
        clearScreen: false,
        build: {
          emptyOutDir: false
        },
        plugins: [
          jsxPlugin(),
          defaultExportPlugin()
        ]
      } as ViteOptions
    )
  }

  // https://github.com/nuxt-community/i18n-module/pull/1079
  const i18nAlias = ctx.config.resolve.alias['~i18n-klona']
  if (i18nAlias) {
    ctx.config.resolve.alias['~i18n-klona'] = i18nAlias.replace('.js', '.mjs')
  }

  await ctx.nuxt.callHook('vite:extend', ctx)

  ctx.nuxt.hook('vite:serverCreated', async ({ server }: { server: vite.ViteDevServer }) => {
    const warmedUrls: string[] = []
    const normalizeResult = (url: string) => server.transformRequest(url).then(r => typeof r === 'string' ? r : r?.code || '')
    const processScript = (html: string) => {
      const results = html.matchAll(/(from ['"]|import\(['"])(?<import>[^'"]*)['"]/mg)
      for (const result of results) {
        const url = result.groups?.import
        if (!url || !url.startsWith('/') || warmedUrls.includes(url)) {
          continue
        }
        warmedUrls.push(url)
        normalizeResult(url).then(processScript)
      }
    }
    processScript(await normalizeResult('/'))
  })

  await buildClient(ctx)
  await buildServer(ctx)
}

export class ViteBuilder {
  builder: any
  nuxt: Nuxt

  constructor (builder: any) {
    this.builder = builder
    this.nuxt = builder.nuxt
  }

  build () {
    return bundle(this.nuxt, this.builder)
  }
}
