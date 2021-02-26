import viteModule from '../../src'
export default {
  components: true,
  buildModules: [
    viteModule
  ],
  plugins: [
    '~/plugins/hello',
    '~/plugins/no-export.js'
  ],
  hooks: {
    'vue-renderer:context' (ssrContext) {
      if (ssrContext.url.includes('?spa')) {
        ssrContext.spa = true
      }
    }
  }
}
