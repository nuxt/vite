import { resolve } from 'path'
import * as vite from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import type { ViteBuildContext } from './vite'

export async function buildClient (ctx: ViteBuildContext) {
  const localConfig = await vite.loadConfigFromFile({
    command: 'serve',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  })

  const inlineConfig: vite.InlineConfig = vite.mergeConfig(ctx.config, {
    define: {
      'process.server': false,
      'process.client': true,
      global: 'window',
      'module.hot': false
    },
    build: {
      outDir: 'dist/client',
      assetsDir: '.',
      rollupOptions: {
        input: resolve(ctx.nuxt.options.buildDir, 'client.js')
      }
    },
    plugins: [
      createVuePlugin()
    ],
    server: {
      middlewareMode: true
    }
  } as vite.InlineConfig)

  const clientConfig = localConfig && localConfig.config
    ? vite.mergeConfig(localConfig.config, inlineConfig)
    : inlineConfig

  for (const p of ctx.builder.plugins) {
    if (!clientConfig.resolve.alias[p.name]) {
      // Do not load server-side plugins on client-side
      clientConfig.resolve.alias[p.name] = p.mode === 'server' ? './empty.js' : p.src
    }
  }

  const viteServer = await vite.createServer(clientConfig)
  const viteMiddleware = (req, res, next) => {
    // Workaround: vite devmiddleware modifies req.url
    const originalURL = req.url
    if (req.url === '/_nuxt/client.js') {
      return res.end('')
    }
    viteServer.middlewares.handle(req, res, (err) => {
      req.url = originalURL
      next(err)
    })
  }
  await ctx.nuxt.callHook('server:devMiddleware', viteMiddleware)
  ctx.nuxt.hook('close', async () => {
    await viteServer.close()
  })
}
