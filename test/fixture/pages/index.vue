<template>
  <div>
    <h2>Hello Vite from Nuxt2!</h2>
    <p><NormalComponent /></p>
    <p><JSXComponent /></p>
    <p><JSXHybrid /></p>
    <pre v-text="stateText" />
  </div>
</template>

<script>
import JSXComponent from '~/components/JSXComponent'
import JSXHybrid from '~/components/JSXHybrid'

export default {
  components: {
    JSXComponent,
    JSXHybrid
  },
  middleware: 'test-middleware',
  computed: {
    stateText () {
      return JSON.stringify(this.$store.state, null, 2).replace(/"/g, '')
    }
  }
}
</script>
