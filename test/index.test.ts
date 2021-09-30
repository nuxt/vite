import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { loadNuxt } from '@nuxt/core'
import { build } from '@nuxt/builder'
import { $fetch } from 'ohmyfetch'
import { expect } from 'chai'
import { Browser, chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('dev', () => {
  let url, browser: Browser, nuxt
  const get = path => $fetch(path, { baseURL: url })

  before(async () => {
    browser = await chromium.launch()
  })

  after(async () => {
    await browser.close()
    await nuxt.close()
  })

  it('Setup dev server', async () => {
    nuxt = await loadNuxt({
      for: 'dev',
      configOverrides: { dev: true },
      rootDir: resolve(__dirname, 'fixture')
    })
    await build(nuxt)
    url = (await nuxt.listen(4040)).url
  }).timeout(5000)

  it('Index works (SSR)', async () => {
    testIndex(await get('/'))
  }).timeout(50000)

  it('Composition API works (SSR)', async () => {
    testCompositionAPI(await get('/capi'))
  })

  it('Index works (SPA)', async () => {
    const page = await browser.newPage({ baseURL: url })
    await page.goto('/?spa')
    await page.waitForLoadState('networkidle')
    const html = await page.innerHTML('body')
    testIndex(html)
  })

  it('Composition API works (SPA)', async () => {
    const page = await browser.newPage({ baseURL: url })
    await page.goto('/capi?spa')
    await page.waitForLoadState('networkidle')
    const html = await page.innerHTML('body')
    testCompositionAPI(html, 'client')
  })

  it('Composition API works (Hydrated SPA)', async () => {
    const page = await browser.newPage({ baseURL: url })
    await page.goto('/capi')
    await page.waitForLoadState('networkidle')
    const html = await page.innerHTML('body')
    testCompositionAPI(html)
  })
})

function testIndex (html) {
  expect(html).contain('Hello Vite from Nuxt2!')
  expect(html).contain('/@vite/client')
  expect(html).contain('NormalComponent')
  expect(html).contain('JSXComponent')
  expect(html).contain('Custom template')
  expect(html).contain('st: 1')
  expect(html).contain('st: 2')
  expect(html).contain('st: 3')
}

function testCompositionAPI (html, location = 'server') {
  expect(html).contain('provided value')
  expect(html).contain(`value was set on the ${location}.`)
}
