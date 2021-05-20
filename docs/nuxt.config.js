import { withDocus } from 'docus'

export default withDocus({
  buildModules: ['vue-plausible'],
  plausible: {
    domain: 'vite.nuxtjs.org'
  }
})
