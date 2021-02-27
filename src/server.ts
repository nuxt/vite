import { resolve } from 'path'
import * as vite from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { watch } from 'chokidar'
import { mkdirp, writeFile } from 'fs-extra'
import debounce from 'debounce'
import { ViteBuildContext } from './types'
import { wpfs } from './utils/wpfs'
import { cacheDirPlugin } from './plugins/cache-dir'

const APP_TEMPLATE = `
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
<head {{ HEAD_ATTRS }}>
  {{ HEAD }}
</head>
<body {{ BODY_ATTRS }}>
  <div id="__nuxt">{{ APP }}</div>
  <script type="module" src="/@vite/client"></script>
  <script type="module" src="/client.js"></script>
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
      window: undefined
    },
    resolve: {
      alias
    },
    build: {
      outDir: 'dist/server',
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
      cacheDirPlugin(ctx.nuxt.options.rootDir, 'server'),
      vuePlugin
    ]
  } as vite.InlineConfig)

  const serverDist = resolve(ctx.nuxt.options.buildDir, 'dist/server')
  await mkdirp(serverDist)

  await writeFile(resolve(serverDist, 'index.ssr.html'), APP_TEMPLATE)
  await writeFile(resolve(serverDist, 'index.spa.html'), APP_TEMPLATE)
  await writeFile(resolve(serverDist, 'client.manifest.json'), JSON.stringify({
    publicPath: '',
    all: [],
    initial: [
      'client.js'
    ],
    async: [],
    modules: {},
    assetsMapping: {}
  }, null, 2))
  await writeFile(resolve(serverDist, 'server.manifest.json'), JSON.stringify({
    entry: 'server.js',
    files: {
      'server.js': 'server.js'
    },
    maps: {}
  }, null, 2))

  const onBuild = debounce(async () => {
    await ctx.nuxt.callHook('build:resources', wpfs)
  }, 200)

  if (!ctx.nuxt.options.ssr) {
    await onBuild()
    return
  }

  await vite.build(serverConfig)
  await onBuild()

  const watcher = watch([
    ctx.nuxt.options.buildDir,
    ctx.nuxt.options.srcDir,
    ctx.nuxt.options.rootDir
  ], {
    ignored: [
      '**/dist/server/**'
    ]
  })

  watcher.on('change', async (_path) => {
    await vite.build(serverConfig)
    await onBuild()
  })

  ctx.nuxt.hook('close', async () => {
    await watcher.close()
  })
}
