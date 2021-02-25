import viteModule from '../../src'
export default {
  buildModules: [
    viteModule
  ],
  plugins: [
    '~/plugins/test.js'
  ],
  hooks: {
    'vue-renderer:context' (ssrContext) {
      if (ssrContext.url.includes('?spa')) {
        ssrContext.spa = true
      }
    }
  }
}
