import { withDocus } from 'docus'

export default withDocus({
  buildModules: ['vue-plausible'],
  docus: {
    colors: {
      primary: '#ffcb23'
    }
  },
  plausible: {
    domain: 'vite.nuxtjs.org'
  }
})
