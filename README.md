<p style="text-align: center">
  <img src="./.github/banner.svg">
</p>

<!-- [![d](https://img.shields.io/npm/dm/nuxt-vite.svg?style=flat-square)](https://npmjs.com/package/nuxt-vite) -->
[![v](https://img.shields.io/npm/v/nuxt-vite/latest.svg?style=flat-square)](https://npmjs.com/package/nuxt-vite)
[![a](https://img.shields.io/github/workflow/status/nuxt/vite/ci/main?style=flat-square)](https://github.com/nuxt/vite/actions)
[![c](https://img.shields.io/codecov/c/gh/nuxt/vite/main?style=flat-square)](https://codecov.io/gh/nuxt/vite)


```
🧪 Note: This is an experimental package and might be deprecated
```

## What is working?


- [x] Using vite in development
- [x] Basic server-side rendering

## Usage

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

## How it works

Nuxt uses has a powerful hooking system to extend internals and abstracted bundler ([@nuxt/webpack](https://github.com/nuxt/nuxt.js/tree/dev/packages/webpack)) which can be replaced.
Vite module, replaces webpack by a similar interface to use vite instead of webpack. Client-side modules are loaded on demand using vite middleware.

Server-side bundle is being created by another vite instance and written to filesystem and passed using hooks to nuxt server-renderer.
Current approach is not most efficient due to usage of filesystem, extra build and lack of lazy loading.
Yet much faster than webpack builds. You can opt-out SSR build using `nuxt dev --spa`

This module could not be possible without [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2) by [@underfin](https://github.com/underfin)

## License

MIT - Nuxt Team
