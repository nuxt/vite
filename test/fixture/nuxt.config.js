import WindiCSS from 'vite-plugin-windicss'
import viteModule from '../../src'

export default {
  components: true,
  vite: {
    plugins: [
      WindiCSS()
    ]
  },
  buildModules: [
    viteModule
  ],
  plugins: [
    '~/plugins/hello.js',
    '~/plugins/no-export.js',
    '~/plugins/windi.js'
  ],
  hooks: {
    'vue-renderer:context' (ssrContext) {
      if (ssrContext.url.includes('?spa')) {
        ssrContext.spa = true
      }
    }
  }
}
