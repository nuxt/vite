<template>
  <div>
    <h2>Hello Vite from Composition API!</h2>
    <pre v-text="injected" />
    <pre v-text="ssrRef" />
    <nuxt-link to="/">/index</nuxt-link>
  </div>
</template>

<script>
import { defineComponent, inject, ssrRef } from '@nuxtjs/composition-api'

export default defineComponent({
  setup () {
    const val = ssrRef(() => `value was set on the ${process.server ? 'server' : 'client'}.`)
    return {
      injected: inject('test', 'not injected'),
      ssrRef: val
    }
  }
})
</script>
