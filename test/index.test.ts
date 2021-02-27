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

  it('SPA works', async () => {
    const page = await createPage('/?spa')
    const html = await page.innerHTML('body')
    testIndex(html)
  })
})

function testIndex (html: string) {
  expect(html).toContain('Hello Vite from Nuxt2!')
  expect(html).toContain('/@vite/client')
  expect(html).toContain('st: 1')
  expect(html).toContain('st: 2')
  expect(html).toContain('st: 3')
}
