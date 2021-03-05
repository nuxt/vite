import { provide, onGlobalSetup } from '@nuxtjs/composition-api'

export default () => {
  onGlobalSetup(() => {
    provide('test', 'provided value')
  })
}
