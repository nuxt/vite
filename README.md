<p style="text-align: center">
  <img src="./docs/static/preview.svg">
</p>

[![d](https://img.shields.io/npm/dm/nuxt-vite.svg?style=flat-square)](https://npmjs.com/package/nuxt-vite)
[![v](https://img.shields.io/npm/v/nuxt-vite/latest.svg?style=flat-square)](https://npmjs.com/package/nuxt-vite)
[![a](https://img.shields.io/github/workflow/status/nuxt/vite/ci/main?style=flat-square)](https://github.com/nuxt/vite/actions)
[![c](https://img.shields.io/codecov/c/gh/nuxt/vite/main?style=flat-square)](https://codecov.io/gh/nuxt/vite)

<!-- [![See Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/nuxt/vite/tree/main/demo) -->


**🧪 Vite mode is experimental and many nuxt modules are still incompatible. If you find a bug, please report via [issues](https://github.com/nuxt/vite/issues) with a minimal reproduction.**


## ⚡ Quick Start

Install `nuxt-vite`: (nuxt >= 2.15.0 is required)

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

That's it! Now you can enjoy super fast `nuxt dev` experience with Vite!

<br>
<h2 style="text-align: center;">
  <a href="https://vite.nuxtjs.org" target="_blank">
📖 Read Documentation</a>
</h2>
<br>

## ✔️ What is working?

- [x] Using vite in development
- [x] Basic server-side rendering
- [x] Basic Hot-Module-Replacement
- [x] Nuxt plugins
- [x] Nuxt components
- [X] Vuex store
- [x] Page middleware
- [X] HTTP module
- [X] i18n module
- [ ] Axios module (works with `--spa`)
- [ ] Composition API
- [ ] Content module
- [ ] Tailwindcss module

## ❤️ Credits

This module could not be possible without [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2) by [@underfin](https://github.com/underfin)

Published under MIT License
