import type { ViteDevServer } from 'vite'

export async function warmupViteServer (server: ViteDevServer, entries: string[]) {
  const warmedUrls = new Set<String>()

  const warmup = async (url: string) => {
    const script = await server.transformRequest(url, { html: false, ssr: true })
    if (!script || typeof script === 'string' || !script.deps) {
      return
    }
    await Promise.all((script.deps).map((url) => {
      if (warmedUrls.has(url)) { return undefined }
      warmedUrls.add(url)
      return warmup(url)
    }))
  }

  await Promise.all(entries.map(entry => warmup(entry)))
}
