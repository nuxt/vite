import { resolve } from 'path'
import { createHash } from 'crypto'
import { readJSON, remove, existsSync, readFile, writeFile, mkdirp } from 'fs-extra'
import { ViteBuildContext } from './types'

const DEFAULT_APP_TEMPLATE = `
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
<head {{ HEAD_ATTRS }}>
  {{ HEAD }}
</head>
<body {{ BODY_ATTRS }}>
  {{ APP }}
</body>
</html>
`

export async function prepareManifests (ctx: ViteBuildContext) {
  const rDist = (...args: string[]): string => resolve(ctx.nuxt.options.buildDir, 'dist', ...args)
  await mkdirp(rDist('server'))

  const customAppTemplateFile = resolve(ctx.nuxt.options.srcDir, 'app.html')
  const APP_TEMPLATE = existsSync(customAppTemplateFile)
    ? (await readFile(customAppTemplateFile, 'utf-8'))
    : DEFAULT_APP_TEMPLATE

  const SPA_TEMPLATE = APP_TEMPLATE
    .replace('{{ APP }}', '<div id="__nuxt">{{ APP }}</div>')
    .replace(
      '</body>',
      '<script type="module" src="/@vite/client"></script><script type="module" src="/_nuxt/client.js"></script></body>'
    )
  const SSR_TEMPLATE = ctx.nuxt.options.dev ? SPA_TEMPLATE : APP_TEMPLATE

  await writeFile(rDist('server/index.ssr.html'), SSR_TEMPLATE)
  await writeFile(rDist('server/index.spa.html'), SPA_TEMPLATE)

  if (ctx.nuxt.options.dev) {
    await stubManifest(ctx)
  } else {
    await generateBuildManifest(ctx)
  }
}

// convert vite's manifest to webpack style
export async function generateBuildManifest (ctx: ViteBuildContext) {
  const rDist = (...args: string[]): string => resolve(ctx.nuxt.options.buildDir, 'dist', ...args)

  const publicPath = ctx.nuxt.options.app.assetsPath // Default: /nuxt/
  const viteClientManifest = await readJSON(rDist('client/manifest.json'))
  const clientEntries = Object.entries(viteClientManifest)

  const asyncEntries = uniq(clientEntries.filter((id: any) => id[1].isDynamicEntry).flatMap(getModuleIds)).filter(Boolean)
  const initialEntries = uniq(clientEntries.filter((id: any) => !id[1].isDynamicEntry).flatMap(getModuleIds)).filter(Boolean)
  const initialJs = initialEntries.filter(isJS)
  const initialAssets = initialEntries.filter(isCSS)

  // Search for polyfill file, we don't include it in the client entry
  const polyfillName = initialEntries.find(id => id.startsWith('polyfills-legacy.'))

  // @vitejs/plugin-legacy uses SystemJS which need to call `System.import` to load modules
  const clientImports = initialJs.filter(id => id !== polyfillName).map(id => publicPath + id)
  const clientEntryCode = `var imports = ${JSON.stringify(clientImports)}\nimports.reduce((p, id) => p.then(() => System.import(id)), Promise.resolve())`
  const clientEntryName = 'entry-legacy.' + hash(clientEntryCode) + '.js'

  const clientManifest = {
    publicPath,
    all: uniq([
      polyfillName,
      clientEntryName,
      ...clientEntries.flatMap(getModuleIds)
    ]).filter(Boolean),
    initial: [
      polyfillName,
      clientEntryName,
      ...initialAssets
    ],
    async: [
      // We move initial entries to the client entry
      ...initialJs,
      ...asyncEntries
    ],
    modules: {},
    assetsMapping: {}
  }

  const serverManifest = {
    entry: 'server.js',
    files: {
      'server.js': 'server.js',
      ...Object.fromEntries(clientEntries.map(([id, entry]) => [id, (entry as any).file]))
    },
    maps: {}
  }

  await writeFile(rDist('client', clientEntryName), clientEntryCode, 'utf-8')

  const clientManifestJSON = JSON.stringify(clientManifest, null, 2)
  await writeFile(rDist('server/client.manifest.json'), clientManifestJSON, 'utf-8')
  await writeFile(rDist('server/client.manifest.mjs'), `export default ${clientManifestJSON}`, 'utf-8')

  const serverManifestJSON = JSON.stringify(serverManifest, null, 2)
  await writeFile(rDist('server/server.manifest.json'), serverManifestJSON, 'utf-8')
  await writeFile(rDist('server/server.manifest.mjs'), `export default ${serverManifestJSON}`, 'utf-8')

  // Remove SSR manifest from public client dir
  await remove(rDist('client/manifest.json'))
  await remove(rDist('client/ssr-manifest.json'))
}
// stub manifest on dev
export async function stubManifest (ctx: ViteBuildContext) {
  const rDist = (...args: string[]): string => resolve(ctx.nuxt.options.buildDir, 'dist', ...args)

  const clientManifest = {
    publicPath: '',
    all: [
      'empty.js'
    ],
    initial: [
      'empty.js'
    ],
    async: [],
    modules: {},
    assetsMapping: {}
  }
  const serverManifest = {
    entry: 'server.js',
    files: {
      'server.js': 'server.js'
    },
    maps: {}
  }

  const clientManifestJSON = JSON.stringify(clientManifest, null, 2)
  await writeFile(rDist('server/client.manifest.json'), clientManifestJSON, 'utf-8')
  await writeFile(rDist('server/client.manifest.mjs'), `export default ${clientManifestJSON}`, 'utf-8')

  const serverManifestJSON = JSON.stringify(serverManifest, null, 2)
  await writeFile(rDist('server/server.manifest.json'), serverManifestJSON)
  await writeFile(rDist('server/server.manifest.mjs'), serverManifestJSON)
}
function hash (input: string, length = 8) {
  return createHash('sha256')
    .update(input)
    .digest('hex')
    .substr(0, length)
}
function uniq<T> (arr: T[]): T[] {
  return Array.from(new Set(arr))
}
// Copied from vue-bundle-renderer utils
const IS_JS_RE = /\.[cm]?js(\?[^.]+)?$/
const IS_MODULE_RE = /\.mjs(\?[^.]+)?$/
const HAS_EXT_RE = /[^./]+\.[^./]+$/
const IS_CSS_RE = /\.css(\?[^.]+)?$/

export function isJS (file: string) {
  return IS_JS_RE.test(file) || !HAS_EXT_RE.test(file)
}

export function isModule (file: string) {
  return IS_MODULE_RE.test(file) || !HAS_EXT_RE.test(file)
}

export function isCSS (file: string) {
  return IS_CSS_RE.test(file)
}
function getModuleIds ([, value]: [string, any]) {
  if (!value) { return [] }
  // Only include legacy and css ids
  return [value.file, ...value.css || []].filter(id => isCSS(id) || id.match(/-legacy\./))
}
