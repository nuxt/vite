import { resolve } from 'path'
import { builtinModules } from 'module'
import { createHash } from 'crypto'
import * as vite from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import consola from 'consola'
import { writeFile } from 'fs-extra'
import { ViteBuildContext, ViteOptions } from './types'
import { wpfs } from './utils/wpfs'
import { jsxPlugin } from './plugins/jsx'
import { generateDevSSRManifest } from './manifest'
import { uniq } from './utils'

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
      outDir: resolve(ctx.nuxt.options.buildDir, 'dist/server'),
      assetsDir: ctx.nuxt.options.app.assetsPath.replace(/^\/|\/$/, ''),
      ssr: true,
      ssrManifest: true,
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

  const onBuild = () => ctx.nuxt.callHook('build:resources', wpfs)

  // Production build
  if (!ctx.nuxt.options.dev) {
    const start = Date.now()
    consola.info('Building server...')
    await vite.build(serverConfig)
    await onBuild()
    consola.success(`Server built in ${Date.now() - start}ms`)
    return
  }

  // Start development server
  const viteServer = await vite.createServer(serverConfig)
  // Initialize plugins
  await viteServer.pluginContainer.buildStart({})

  const { code: esm } = await bundleRequest(viteServer, '/.nuxt/server.js')

  // FIXME: vue-bundle-renderer does not support ESM
  const cjs = `
module.exports = async (ctx) => {
  // const server = await import('${resolve(ctx.nuxt.options.buildDir, 'dist/server/server.mjs')}')
  const server = require('jiti')()('${resolve(ctx.nuxt.options.buildDir, 'dist/server/server.mjs')}', { requireCache: false, cache: false, v8cache: false })
  const result = await server.default().then(i => i.default(ctx))
  return result
}`

  await writeFile(resolve(ctx.nuxt.options.buildDir, 'dist/server/server.mjs'), esm, 'utf-8')
  await writeFile(resolve(ctx.nuxt.options.buildDir, 'dist/server/server.js'), cjs, 'utf-8')

  await writeFile(resolve(ctx.nuxt.options.buildDir, 'dist/server/ssr-manifest.json'), JSON.stringify({}, null, 2), 'utf-8')

  await generateDevSSRManifest(ctx)
  await onBuild()
  ctx.nuxt.hook('close', () => viteServer.close())
}

// ---- Vite Dev Bundler POC ----

interface TransformChunk {
  id: string,
  code: string,
  deps: string[],
  parents: string[]
}

interface SSRTransformResult {
  code: string,
  map: object,
  deps: string[]
  dynamicDeps: string[]
}

async function transformRequest (viteServer: vite.ViteDevServer, id) {
  // Virtual modules start with `\0`
  if (id && id.startsWith('/@id/__x00__')) {
    id = '\0' + id.slice('/@id/__x00__'.length)
  }

  // Externals
  if (builtinModules.includes(id) || (id.includes('node_modules') && !id.endsWith('.esm.js'))) {
    if (id.startsWith('/@fs')) {
      id = id.substr(4)
    } else if (id.startsWith('/')) {
      id = '.' + id // TODO
    }
    return {
      code: `() => import('${id}')`,
      deps: [],
      dynamicDeps: []
    }
  }

  // Transform
  const res: SSRTransformResult = await viteServer.transformRequest(id, { ssr: true }).catch((err) => {
    // eslint-disable-next-line no-console
    console.warn(`[SSR] Error transforming ${id}: ${err}`)
    // console.error(err)
  }) as SSRTransformResult || { code: '', map: {}, deps: [], dynamicDeps: [] }

  // Wrap into a vite module
  const code = `async function () {
const __vite_ssr_exports__ = {};
const __vite_ssr_exportAll__ = __createViteSSRExportAll__(__vite_ssr_exports__)
${res.code || '/* empty */'};
return __vite_ssr_exports__;
}`
  return { code, deps: res.deps || [], dynamicDeps: res.dynamicDeps || [] }
}

async function transformRequestRecursive (viteServer: vite.ViteDevServer, id, parent = '<entry>', chunks: Record<string, TransformChunk> = {}) {
  if (chunks[id]) {
    chunks[id].parents.push(parent)
    return
  }
  const res = await transformRequest(viteServer, id)
  const deps = uniq([...res.deps, ...res.dynamicDeps])

  chunks[id] = {
    id,
    code: res.code,
    deps,
    parents: [parent]
  } as TransformChunk
  for (const dep of deps) {
    await transformRequestRecursive(viteServer, dep, id, chunks)
  }
  return Object.values(chunks)
}

async function bundleRequest (viteServer: vite.ViteDevServer, id) {
  const chunks = await transformRequestRecursive(viteServer, id)

  const listIds = ids => ids.map(id => `// - ${id} (${hashId(id)})`).join('\n')
  const chunksCode = chunks.map(chunk => `
// --------------------
// Request: ${chunk.id}
// Parents: \n${listIds(chunk.parents)}
// Dependencies: \n${listIds(chunk.deps)}
// --------------------
const ${hashId(chunk.id)} = ${chunk.code}
`).join('\n')

  const manifestCode = 'const $chunks = {\n' +
   chunks.map(chunk => ` '${chunk.id}': ${hashId(chunk.id)}`).join(',\n') + '\n}'

  const dynamicImportCode = `
function __vite_ssr_import__ (id) {
  return Promise.resolve($chunks[id]()).then(mod => {
    if (mod && !('default' in mod))
      mod.default = mod
    return mod
  })
}
function __vite_ssr_dynamic_import__(id) {
  return __vite_ssr_import__(id)
}
`

  // https://github.com/vitejs/vite/blob/fb406ce4c0fe6da3333c9d1c00477b2880d46352/packages/vite/src/node/ssr/ssrModuleLoader.ts#L121-L133
  const helpers = `
function __createViteSSRExportAll__(ssrModule) {
  return (sourceModule) => {
    for (const key in sourceModule) {
      if (key !== 'default') {
        Object.defineProperty(sourceModule, key, {
          enumerable: true,
          configurable: true,
          get() {
            return sourceModule[key]
          }
        })
      }
    }
  }
}
`

  // TODO: implement real HMR
  const metaPolyfill = `
const __vite_ssr_import_meta__ = {
  hot: {
    accept() {}
  }
}
`

  const code = [
    metaPolyfill,
    chunksCode,
    manifestCode,
    dynamicImportCode,
    helpers,
    `export default ${hashId(id)}`
  ].join('\n\n')

  return { code }
}

function hashId (id: string) {
  return '$id_' + hash(id)
}

function hash (input: string, length = 8) {
  return createHash('sha256')
    .update(input)
    .digest('hex')
    .substr(0, length)
}
