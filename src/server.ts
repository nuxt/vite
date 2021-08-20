import { resolve } from 'path'
import { createHash } from 'crypto'
import * as vite from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { existsSync, readFile, mkdirp, writeFile, readJSON, writeJSON } from 'fs-extra'
import consola from 'consola'
import { join } from 'upath'
import type { RollupWatcher } from 'rollup'
import { ViteBuildContext, ViteOptions } from './types'
import { wpfs } from './utils/wpfs'
import { jsxPlugin } from './plugins/jsx'

const DEFAULT_APP_TEMPLATE = `
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
<head {{ HEAD_ATTRS }}>
  {{ HEAD }}
</head>
<body {{ BODY_ATTRS }}>
  {{ APP }}
</body>
</html>
`

export async function buildServer (ctx: ViteBuildContext) {
  // Workaround to disable HMR
  const _env = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  const vuePlugin = createVuePlugin(ctx.config.vue)
  process.env.NODE_ENV = _env

  const alias = {}
  for (const p of ctx.builder.plugins) {
    alias[p.name] = p.mode === 'client'
      ? `defaultexport:${resolve(ctx.nuxt.options.buildDir, 'empty.js')}`
      : `defaultexport:${p.src}`
  }

  const serverConfig: vite.InlineConfig = vite.mergeConfig(ctx.config, {
    define: {
      'process.server': true,
      'process.client': false,
      'process.static': false,
      'typeof window': '"undefined"',
      'typeof document': '"undefined"',
      'typeof navigator': '"undefined"',
      'typeof location': '"undefined"',
      'typeof XMLHttpRequest': '"undefined"'
    },
    cacheDir: resolve(ctx.nuxt.options.rootDir, 'node_modules/.cache/vite/server'),
    resolve: {
      alias
    },
    ssr: {
      external: [
        'axios'
      ],
      noExternal: [
        ...ctx.nuxt.options.build.transpile.filter(i => typeof i === 'string')
      ]
    },
    build: {
      outDir: 'dist/server',
      assetsDir: '_nuxt',
      ssr: true,
      rollupOptions: {
        input: resolve(ctx.nuxt.options.buildDir, 'server.js'),
        onwarn (warning, rollupWarn) {
          if (!['UNUSED_EXTERNAL_IMPORT'].includes(warning.code)) {
            rollupWarn(warning)
          }
        }
      }
    },
    plugins: [
      jsxPlugin(),
      vuePlugin
    ]
  } as ViteOptions)

  await ctx.nuxt.callHook('vite:extendConfig', serverConfig, { isClient: false, isServer: true })

  const serverDist = resolve(ctx.nuxt.options.buildDir, 'dist/server')
  await mkdirp(serverDist)
  const r = (...args: string[]): string => resolve(serverDist, ...args)

  const customAppTemplateFile = resolve(ctx.nuxt.options.srcDir, 'app.html')
  const APP_TEMPLATE = existsSync(customAppTemplateFile)
    ? (await readFile(customAppTemplateFile, 'utf-8'))
    : DEFAULT_APP_TEMPLATE

  const SPA_TEMPLATE = APP_TEMPLATE
    .replace('{{ APP }}', '<div id="__nuxt">{{ APP }}</div>')
    .replace(
      '</body>',
      '<script type="module" src="/@vite/client"></script><script type="module" src="/client.js"></script></body>'
    )
  const SSR_TEMPLATE = ctx.nuxt.options.dev ? SPA_TEMPLATE : APP_TEMPLATE

  await writeFile(r('index.ssr.html'), SSR_TEMPLATE)
  await writeFile(r('index.spa.html'), SPA_TEMPLATE)

  if (ctx.nuxt.options.dev) {
    await stubManifest(ctx)
  } else {
    await generateBuildManifest(ctx)
  }

  const onBuild = () => ctx.nuxt.callHook('build:resources', wpfs)
  const build = async () => {
    const start = Date.now()
    await vite.build(serverConfig)
    await onBuild()
    consola.info(`Server built in ${Date.now() - start}ms`)
  }

  await build()

  if (ctx.nuxt.options.dev) {
    const watcher = await vite.build({
      ...serverConfig,
      build: {
        ...serverConfig.build,
        watch: {
          include: [
            join(ctx.nuxt.options.buildDir, '**/*'),
            join(ctx.nuxt.options.srcDir, '**/*'),
            join(ctx.nuxt.options.rootDir, '**/*')
          ],
          exclude: [
            '**/dist/server/**'
          ]
        }
      }
    }) as RollupWatcher

    let start = Date.now()
    watcher.on('event', async (event) => {
      if (event.code === 'BUNDLE_START') {
        start = Date.now()
      } else if (event.code === 'BUNDLE_END') {
        await onBuild()
        consola.info(`Server rebuilt in ${Date.now() - start}ms`)
      } else if (event.code === 'ERROR') {
        consola.error(event.error)
      }
    })

    ctx.nuxt.hook('close', () => watcher.close())
  } else {
    await build()
  }
}

// convert vite's manifest to webpack style
async function generateBuildManifest (ctx: ViteBuildContext) {
  const serverDist = resolve(ctx.nuxt.options.buildDir, 'dist/server')
  const clientDist = resolve(ctx.nuxt.options.buildDir, 'dist/client')
  const r = (...args: string[]): string => resolve(serverDist, ...args)

  const publicPath = '/_nuxt/'
  const viteClientManifest = await readJSON(join(clientDist, 'manifest.json'))

  function getModuleIds ([, value]: [string, any]) {
    if (!value) {
      return []
    }
    return [value.file, ...value.css || []]
      .filter(i => !i.endsWith('.js') || i.match(/-legacy\./)) // only use legacy build
  }

  const asyncEntries = uniq(
    Object.entries(viteClientManifest)
      .filter((i: any) => i[1].isDynamicEntry)
      .flatMap(getModuleIds)
  ).filter(i => i)
  const initialEntries = uniq(
    Object.entries(viteClientManifest)
      .filter((i: any) => !i[1].isDynamicEntry)
      .flatMap(getModuleIds)
  ).filter(i => i)
  const initialJs = initialEntries.filter(i => i.endsWith('.js'))
  const initialAssets = initialEntries.filter(i => !i.endsWith('.js'))

  // search for polyfill file, we don't include it in the client entry
  const polyfillName = initialEntries.find(i => i.startsWith('polyfills-legacy.'))

  // @vitejs/plugin-legacy uses SystemJS which need to call `System.import` to load modules
  const clientEntryCode = initialJs
    .filter(i => !i.startsWith('polyfills-legacy.'))
    .map(i => `System.import("${publicPath}${i}");`)
    .join('\n')
  const clientEntryHash = createHash('sha256')
    .update(clientEntryCode)
    .digest('hex')
    .substr(0, 8)
  const clientEntryName = 'entry.' + clientEntryHash + '.js'

  const clientManifest = {
    publicPath,
    all: uniq([
      polyfillName,
      clientEntryName,
      ...Object.entries(viteClientManifest)
        .flatMap(getModuleIds)
    ]).filter(i => i),
    initial: [
      polyfillName,
      clientEntryName,
      ...initialAssets
    ],
    async: [
      // we move initial entries to the client entry
      ...initialJs,
      ...asyncEntries
    ],
    modules: {},
    assetsMapping: {}
  }
  const serverManifest = {
    entry: 'server.js',
    files: {
      'server.js': 'server.js',
      ...Object.fromEntries(Object.entries(viteClientManifest).map((i: any) => [i[0], i[1].file]))
    },
    maps: {}
  }

  await writeFile(join(clientDist, clientEntryName), clientEntryCode, 'utf-8')
  await writeJSON(r('client.manifest.json'), clientManifest, { spaces: 2 })
  await writeJSON(r('server.manifest.json'), serverManifest, { spaces: 2 })
}

// stub manifest on dev
async function stubManifest (ctx: ViteBuildContext) {
  const serverDist = resolve(ctx.nuxt.options.buildDir, 'dist/server')
  const r = (...args: string[]): string => resolve(serverDist, ...args)

  await writeJSON(r('client.manifest.json'), {
    publicPath: '',
    all: [
      'client.js'
    ],
    initial: [
      'client.js'
    ],
    async: [],
    modules: {},
    assetsMapping: {}
  }, { spaces: 2 })
  await writeJSON(r('server.manifest.json'), {
    entry: 'server.js',
    files: {
      'server.js': 'server.js'
    },
    maps: {}
  }, { spaces: 2 })
}

function uniq<T> (arr:T[]): T[] {
  return Array.from(new Set(arr))
}
