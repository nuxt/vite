import { createPage, setupTest } from '@nuxt/test-utils'

describe('browser', () => {
  setupTest({
    server: true,
    browser: true,
    config: {
      dev: true
    }
  })

  it('SSR works', async () => {
    const page = await createPage('/')
    const html = await page.innerHTML('body')
    expect(html).toContain('Hello Vite from Nuxt2!')
    expect(html).toContain('/@vite/client')
    expect(html).toContain('st: 1')
    expect(html).toContain('st: 2')
    expect(html).toContain('st: 3')
  })

  it('SPA works', async () => {
    const page = await createPage('/?spa')
    const html = await page.innerHTML('body')
    expect(html).toContain('Hello Vite from Nuxt2!')
    expect(html).toContain('/@vite/client')
  })
})
