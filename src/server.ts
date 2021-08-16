import { resolve } from 'path'
import * as vite from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { watch } from 'chokidar'
import { existsSync, readFile, mkdirp, writeFile, readJSON, writeJSON, readdir } from 'fs-extra'
import debounce from 'p-debounce'
import consola from 'consola'
import { join } from 'upath'
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
  const clientDist = resolve(ctx.nuxt.options.buildDir, 'dist/client')
  await mkdirp(serverDist)

  const clientFiles = existsSync(clientDist) ? await readdir(clientDist) : []
  const polyfillName = clientFiles.find(i => i.startsWith('polyfills-legacy.'))

  const r = (...args: string[]): string => resolve(serverDist, ...args)

  const viteClientManifest = existsSync(clientDist)
    ? await readJSON(join(clientDist, 'manifest.json'))
    : {}

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
  const SSR_TEMPLATE = APP_TEMPLATE
    .replace('{{ APP }}', '<div id="__nuxt">{{ APP }}</div>')

  await writeFile(r('index.ssr.html'), SSR_TEMPLATE)
  await writeFile(r('index.spa.html'), SPA_TEMPLATE)

  function getModuleIds ([key, value]: [string, any]) {
    return [value.file, ...value.css || []]
      .filter(i => !i.endsWith('.js') || i.match(/-legacy\./)) // only use legacy build
  }

  const clientManifest = {
    publicPath: '/_nuxt/',
    all: uniq([
      polyfillName,
      ...Object.entries(viteClientManifest)
        .flatMap(getModuleIds)
    ]).filter(i => i),
    initial: uniq([
      polyfillName,
      ...Object.entries(viteClientManifest)
        .filter((i: any) => !i[1].isDynamicEntry)
        .flatMap(getModuleIds)
    ]).filter(i => i),
    async: uniq(
      Object.entries(viteClientManifest)
        .filter((i: any) => i[1].isDynamicEntry)
        .flatMap(getModuleIds)
    ).filter(i => i),
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

  await writeJSON(r('client.manifest.json'), clientManifest, { spaces: 2 })
  await writeJSON(r('server.manifest.json'), serverManifest, { spaces: 2 })

  const onBuild = () => ctx.nuxt.callHook('build:resources', wpfs)
  const build = async () => {
    const start = Date.now()
    await vite.build(serverConfig)
    await onBuild()
    consola.info(`Server built in ${Date.now() - start}ms`)
  }

  const debouncedBuild = debounce(build, 300)

  await build()

  if (ctx.nuxt.options.dev) {
    const watcher = watch([
      ctx.nuxt.options.buildDir,
      ctx.nuxt.options.srcDir,
      ctx.nuxt.options.rootDir
    ], {
      ignored: [
        '**/dist/server/**'
      ]
    })

    watcher.on('change', () => debouncedBuild())

    ctx.nuxt.hook('close', async () => {
      await watcher.close()
    })
  }
}

function uniq<T> (arr:T[]): T[] {
  return Array.from(new Set(arr))
}
