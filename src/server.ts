import { resolve } from 'path'
import * as vite from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { watch } from 'chokidar'
import { exists, readFile, mkdirp, writeFile } from 'fs-extra'
import debounce from 'debounce'
import consola from 'consola'
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
      ]
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
      jsxPlugin(),
      vuePlugin
    ]
  } as ViteOptions)

  await ctx.nuxt.callHook('vite:extendConfig', serverConfig, { isClient: false, isServer: true })

  const serverDist = resolve(ctx.nuxt.options.buildDir, 'dist/server')
  await mkdirp(serverDist)

  const customAppTemplateFile = resolve(ctx.nuxt.options.srcDir, 'app.html')
  const APP_TEMPLATE = await exists(customAppTemplateFile)
    ? (await readFile(customAppTemplateFile, 'utf-8'))
        .replace('{{ APP }}', '<div id="__nuxt">{{ APP }}</div>')
        .replace(
          '</body>',
          '<script type="module" src="/@vite/client"></script><script type="module" src="/client.js"></script></body>'
        )
    : DEFAULT_APP_TEMPLATE

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

  const onBuild = () => ctx.nuxt.callHook('build:resources', wpfs)

  if (!ctx.nuxt.options.ssr) {
    await onBuild()
    return
  }

  const build = debounce(async () => {
    const start = Date.now()
    await vite.build(serverConfig)
    await onBuild()
    consola.info(`Server built in ${Date.now() - start}ms`)
  }, 300)

  await build()

  const watcher = watch([
    ctx.nuxt.options.buildDir,
    ctx.nuxt.options.srcDir,
    ctx.nuxt.options.rootDir
  ], {
    ignored: [
      '**/dist/server/**'
    ]
  })

  watcher.on('change', () => build())

  ctx.nuxt.hook('close', async () => {
    await watcher.close()
  })
}
