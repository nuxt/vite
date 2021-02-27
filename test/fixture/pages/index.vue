<template>
  <div>
    Hello Vite from Nuxt2!
    <Foobar />
    <br>
    Store:
    <pre v-text="stateText" />
  </div>
</template>

<script>
export default {
  computed: {
    stateText () {
      return JSON.stringify(this.$store.state, null, 2).replace(/"/g, '')
    }
  }
}
</script>
