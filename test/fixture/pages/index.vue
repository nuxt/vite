<template>
  <div>
    <h2>Hello Vite from Nuxt2!</h2>
    <p><NormalComponent /></p>
    <p><JSXComponent /></p>
    <pre v-text="stateText" />
    {{ ip }}
  </div>
</template>

<script>
import JSXComponent from '~/components/JSXComponent'

export default {
  components: {
    JSXComponent
  },
  middleware: 'test-middleware',
  async asyncData ({ $axios }) {
    return {
      ip: await $axios.$get('http://icanhazip.com')
    }
  },
  computed: {
    stateText () {
      return JSON.stringify(this.$store.state, null, 2).replace(/"/g, '')
    }
  }
}
</script>
