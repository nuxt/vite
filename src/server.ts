import { resolve } from 'path'
import { createHash } from 'crypto'
import * as vite from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { watch } from 'chokidar'
import { existsSync, readFile, mkdirp, writeFile, readJSON, writeJSON } from 'fs-extra'
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

// convert vite's manifest to webpack style
async function generateBuildManifest (ctx: ViteBuildContext) {
  const serverDist = resolve(ctx.nuxt.options.buildDir, 'dist/server')
  const clientDist = resolve(ctx.nuxt.options.buildDir, 'dist/client')
  const r = (...args: string[]): string => resolve(serverDist, ...args)

  const publicPath = ctx.nuxt.options.app.assetsPath // Default: /nuxt/
  const viteClientManifest = await readJSON(join(clientDist, 'manifest.json'))

  function getModuleIds ([, value]: [string, any]) {
    if (!value) {
      return []
    }
    return [value.file, ...value.css || []]
      .filter(id => !isJS(id) || id.match(/-legacy\./)) // only use legacy build
  }

  const asyncEntries = uniq(
    Object.entries(viteClientManifest)
      .filter((id: any) => id[1].isDynamicEntry)
      .flatMap(getModuleIds)
  ).filter(Boolean)
  const initialEntries = uniq(
    Object.entries(viteClientManifest)
      .filter((i: any) => !i[1].isDynamicEntry)
      .flatMap(getModuleIds)
  ).filter(Boolean)
  const initialJs = initialEntries.filter(isJS)
  const initialAssets = initialEntries.filter(isCSS)

  // search for polyfill file, we don't include it in the client entry
  const polyfillName = initialEntries.find(i => i.startsWith('polyfills-legacy.'))

  // @vitejs/plugin-legacy uses SystemJS which need to call `System.import` to load modules
  const clientImports = initialJs.filter(id => !id.startsWith('polyfills-legacy.')).map(id => publicPath + id)
  const clientEntryCode = `var imports = ${JSON.stringify(clientImports)}\nimports.reduce((p, id) => p.then(() => System.import(id)), Promise.resolve())`
  const clientEntryHash = hash(clientEntryCode)
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

  const clientManifestJSON = JSON.stringify(clientManifest, null, 2)
  await writeFile(r('client.manifest.json'), clientManifestJSON, 'utf-8')
  await writeFile(r('client.manifest.mjs'), `export default ${clientManifestJSON}`, 'utf-8')

  const serverManifestJSON = JSON.stringify(serverManifest, null, 2)
  await writeFile(r('server.manifest.json'), serverManifestJSON, 'utf-8')
  await writeFile(r('server.manifest.mjs'), `export default ${serverManifestJSON}`, 'utf-8')
}

// stub manifest on dev
async function stubManifest (ctx: ViteBuildContext) {
  const serverDist = resolve(ctx.nuxt.options.buildDir, 'dist/server')
  const r = (...args: string[]): string => resolve(serverDist, ...args)

  const clientManifest = {
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
  }
  const serverManifest = {
    entry: 'server.js',
    files: {
      'server.js': 'server.js'
    },
    maps: {}
  }

  const clientManifestJSON = JSON.stringify(clientManifest, null, 2)
  await writeFile(r('client.manifest.json'), clientManifestJSON, 'utf-8')
  await writeFile(r('client.manifest.mjs'), `export default ${clientManifestJSON}`, 'utf-8')
  await writeJSON(r('server.manifest.json'), serverManifest, { spaces: 2 })
}

function hash (input: string, length = 8) {
  return createHash('sha256')
    .update(input)
    .digest('hex')
    .substr(0, length)
}

function uniq<T> (arr:T[]): T[] {
  return Array.from(new Set(arr))
}

// Copied from vue-bundle-renderer utils
const IS_JS_RE = /\.[cm]?js(\?[^.]+)?$/
const IS_MODULE_RE = /\.mjs(\?[^.]+)?$/
const HAS_EXT_RE = /[^./]+\.[^./]+$/
const IS_CSS_RE = /\.css(\?[^.]+)?$/

export function isJS (file: string) {
  return IS_JS_RE.test(file) || !HAS_EXT_RE.test(file)
}

export function isModule (file: string) {
  return IS_MODULE_RE.test(file) || !HAS_EXT_RE.test(file)
}

export function isCSS (file: string) {
  return IS_CSS_RE.test(file)
}
