<template>
  <div>
    <h2>Hello Vite from Nuxt2!</h2>
    <p><Foobar /></p>
    <pre v-text="stateText" />
    <p>{{ res }}</p>
  </div>
</template>

<script>
export default {
  middleware: 'test-middleware',
  async asyncData ({ $http }) {
    const res = await $http.$get('/api/test')
    return {
      res
    }
  },
  computed: {
    stateText () {
      return JSON.stringify(this.$store.state, null, 2).replace(/"/g, '')
    }
  }
}
</script>
