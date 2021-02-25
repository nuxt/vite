export default function () {
  const { nuxt } = this

  if (!nuxt.options.dev) {
    return
  }

  nuxt.hook('builder:prepared', async (builder) => {
    builder.bundleBuilder.close()
    delete builder.bundleBuilder
    const { ViteBuilder } = await import('./vite')
    builder.bundleBuilder = new ViteBuilder(builder)
  })
}
