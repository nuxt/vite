<p style="text-align: center">
  <img src="./.github/banner.svg">
</p>

[![d](https://img.shields.io/npm/dm/nuxt-vite.svg?style=flat-square)](https://npmjs.com/package/nuxt-vite)
[![v](https://img.shields.io/npm/v/nuxt-vite/latest.svg?style=flat-square)](https://npmjs.com/package/nuxt-vite)
[![a](https://img.shields.io/github/workflow/status/nuxt/vite/ci/main?style=flat-square)](https://github.com/nuxt/vite/actions)
[![c](https://img.shields.io/codecov/c/gh/nuxt/vite/main?style=flat-square)](https://codecov.io/gh/nuxt/vite)


**🧪 Vite mode is experimental and many nuxt modules are still incompatible**

**If found a bug, please report via [issues](https://github.com/nuxt/vite/issues) with a minimal reproduction**

<!-- [![See Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/nuxt/vite/tree/main/demo) -->

## ✔️ What is working?

- [x] Using vite in development
- [x] Basic server-side rendering
- [x] Basic Hot-Module-Replacement
- [x] Nuxt plugins
- [x] Nuxt components
- [X] Vuex store
- [x] Page middleware
- [X] HTTP module
- [ ] Axios module (works with `--spa`)
- [ ] Composition API
- [ ] Content module
- [ ] Tailwindcss module

## ⚡ Usage

Install package:

```sh
yarn add --dev nuxt-vite
# OR
npm i -D nuxt-vite
```

Add to `buildModules`:

```js
// nuxt.config
export default {
  buildModules: [
    'nuxt-vite'
  ]
}
```

**Note:** Nuxt >= 2.15.0 is required

## 💡 Vite Config

You can pass Vite configurations and plugins into the `vite` entry of `nuxt.config`

```js
import ViteWindiCSS from 'vite-plugin-windicss'

// nuxt.config
export default {
  buildModules: [
    'nuxt-vite'
  ],
  vite: {
    plugins: [
      ViteWindiCSS()
    ],
    /* options for vite-plugin-vue2 */
    vue: {
      vueTemplateOptions: { /* ... */ },
      jsx: true,
    },
    /* ... */
  }
}
```

More details refer to [Vite's documentations](https://vitejs.dev/config/) and [`vite-plugin-vue2`](https://github.com/underfin/vite-plugin-vue2).

## 🐛 Common Issues

**💡 Take a look at [issues](https://github.com/nuxt/vite/issues) for known issues and workarounds**

### `Can't find loader handling '.vue' files`

While we added a workaround to mitigate this, vite recommends explicitly defining extensions for non javascript assets.

```diff
- import MyComponent from '~/components/MyComponent'
+ import MyComponent from '~/components/MyComponent.vue'
```

### `no such file or directory, rmdir node_modules/.vite/temp`

This is a race condition that server cache dir removes when reloading ([vitejs/vite/pull/2299](https://github.com/vitejs/vite/pull/2299))

Currently using a fork of vite to address this issue. If still having, please add version and error in [#2](https://github.com/nuxt/vite/issues/2)

### `.gql` support

Curretnly there is no module support for handling gql files ([#31](https://github.com/nuxt/vite/issues/31)).

Best solution for now is to wrap gql code into `js` or `ts` and using [graphql-tag](https://www.npmjs.com/package/graphql-tag) or using raw GraphQL queries. Remember to add `loc.source.body`.

**Example:**

```js
// queries/products.js
import gql from 'graphql-tag'
export default gql`
  query Products {
    products {
      id
      name
    }
  }
`
```

```js
// pages/index.vue
import products  from '~/queries/products'
export default {
    async asyncData({ $strapi }) {
        const response = await $strapi.graphql({
            query: products.loc.source.body,
        })
        return {
            response
        }
    }
}
```

## 🤔 How it works

Nuxt uses has a powerful hooking system to extend internals.

Default bundler ([@nuxt/webpack](https://github.com/nuxt/nuxt.js/tree/dev/packages/webpack)) can be replaced by a nuxt module. `nuxt-vite` replaces webpack by a similar interface to use vite instead of webpack. (see [src/index.ts](./src/index.ts) and [src/vite.ts](./src/vite.ts))

Client-side modules are loaded on demand using vite middleware

Server-side bundle is being created by another vite instance and written to filesystem and passed using hooks to nuxt server-renderer.
Current approach is not most efficient due to usage of filesystem, extra build and lack of lazy loading.
Yet much faster than webpack builds. You can opt-out SSR build using `nuxt dev --spa`.

## ❤️ Credits

This module could not be possible without [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2) by [@underfin](https://github.com/underfin)

## License

MIT - Nuxt Team
