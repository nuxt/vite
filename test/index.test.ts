import { createPage, setupTest, get } from '@nuxt/test-utils'

describe('browser', () => {
  setupTest({
    server: true,
    browser: true,
    config: {
      dev: true
    }
  })

  it('SSR works', async () => {
    const html = (await get('/')).body as string
    testIndex(html)
  })

  it('Composition API works (SSR)', async () => {
    const html = (await get('/capi')).body as string
    testCompositionAPI(html)
  })

  it('SPA works', async () => {
    const page = await createPage('/?spa')
    await page.waitForLoadState('networkidle')
    const html = await page.innerHTML('body')
    testIndex(html)
  }, 15000)

  it('Composition API works (SPA)', async () => {
    const page = await createPage('/capi?spa')
    await page.waitForLoadState('networkidle')
    const html = await page.innerHTML('body')
    testCompositionAPI(html, 'client')
  }, 15000)

  it('Composition API works (SSR client-load)', async () => {
    const page = await createPage('/capi')
    await page.waitForLoadState('networkidle')
    const html = await page.innerHTML('body')
    testCompositionAPI(html)
  }, 15000)
})

function testIndex (html: string) {
  expect(html).toContain('Hello Vite from Nuxt2!')
  expect(html).toContain('/@vite/client')
  expect(html).toContain('NormalComponent')
  expect(html).toContain('JSXComponent')
  expect(html).toContain('st: 1')
  expect(html).toContain('st: 2')
  expect(html).toContain('st: 3')
}

function testCompositionAPI (html: string, location = 'server') {
  expect(html).toContain('provided value')
  expect(html).toContain(`value was set on the ${location}.`)
}
