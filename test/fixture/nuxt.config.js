import viteModule from '../../src'
export default {
  buildModules: [
    viteModule
  ],
  plugins: [
    '~/plugins/hello.js'
  ],
  hooks: {
    'vue-renderer:context' (ssrContext) {
      if (ssrContext.url.includes('?spa')) {
        ssrContext.spa = true
      }
    }
  }
}
