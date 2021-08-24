import viteModule from '../../src'

export default {
  components: true,
  buildModules: [
    '@nuxtjs/composition-api/module',
    viteModule
  ],
  serverMiddleware: {
    '/api/test': '~/serverMiddleware/test'
  },
  plugins: [
    '~/plugins/hello',
    '~/plugins/capi',
    '~/plugins/plugin.client',
    '~/plugins/plugin.server',
    '~/plugins/no-export.js',
    '~/plugins/style'
  ],
  hooks: {
    'vue-renderer:context' (ssrContext) {
      if (ssrContext.url.includes('?spa')) {
        ssrContext.spa = true
      }
    }
  },
  vite: {
    ssr: true,
    build: true,
    server: {
      fs: {
        strict: false
      }
    }
  }
}
