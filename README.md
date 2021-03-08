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


**[📖 Read documentation for more](https://vite.nuxtjs.org)**

## ✔️ What is working?

Features:

- [x] Using vite in development
- [x] Basic server-side rendering
- [x] Basic Hot-Module-Replacement
- [x] Nuxt [plugins](https://nuxtjs.org/docs/2.x/directory-structure/plugins/)
- [x] Nuxt [components](https://github.com/nuxt/components/)
- [X] Vuex store
- [x] Page [middleware](https://nuxtjs.org/docs/2.x/directory-structure/middleware/)
- [x] Basic [jsx](https://vuejs.org/v2/guide/render-function.html#JSX) (pass `h` as first argument)
- [x] [Postcss](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#postcss)

Modules:

- [X] [http](https://http.nuxtjs.org/)
- [x] [axios](https://axios.nuxtjs.org/)
- [X] [i18n](https://i18n.nuxtjs.org/)
- [x] [content](https://content.nuxtjs.org/)
- [x] [Tailwind](https://tailwindcss.nuxtjs.org/)
- [x] [Composition API](https://composition-api.nuxtjs.org/)
- [ ] [style-resources](https://github.com/nuxt-community/style-resources-module) ([workaround](https://vite.nuxtjs.org/misc/common-issues#styleresources))

We are trying to make most of modules and options working out-of-the-box. If you are a module maintainer,
 please see [this section](https://vite.nuxtjs.org/advanced/modules) for supporting vite. If a module or feature is missing, feel free openining an issue.

## ❤️ Credits

This module could not be possible without [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2) by [@underfin](https://github.com/underfin)

Published under MIT License
