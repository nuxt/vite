<template>
  <div>
    <h2>Hello Vite from Nuxt2!</h2>
    <div><NormalComponent /></div>
    <div><JSXComponent /></div>
    <div><JSXHybrid /></div>
    <pre v-text="stateText" />
    <nuxt-link to="/capi">/capi</nuxt-link>
  </div>
</template>

<script>
import JSXComponent from '~/components/JSXComponent'
import JSXHybrid from '~/components/JSXHybrid'
import NormalComponent from '~/components/NormalComponent'

export default {
  components: {
    JSXComponent,
    JSXHybrid,
    NormalComponent
  },
  middleware: 'test-middleware',
  computed: {
    stateText () {
      return JSON.stringify(this.$store.state, null, 2).replace(/"/g, '')
    }
  }
}
</script>
