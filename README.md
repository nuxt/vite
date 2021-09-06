<p style="text-align: center">
  <img src="./docs/static/preview.svg" alt="Vite Experience with Nuxt 2. GitHub.com/nuxt/vite">
</p>

[![](https://img.shields.io/npm/dm/nuxt-vite.svg?style=flat-square)](https://npmjs.com/package/nuxt-vite)
[![](https://img.shields.io/npm/v/nuxt-vite/latest.svg?style=flat-square)](https://npmjs.com/package/nuxt-vite)
[![](https://img.shields.io/github/workflow/status/nuxt/vite/ci/main?style=flat-square)](https://github.com/nuxt/vite/actions)
[![](https://img.shields.io/codecov/c/gh/nuxt/vite/main?style=flat-square)](https://codecov.io/gh/nuxt/vite)

<!-- [![See Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/nuxt/vite/tree/main/demo) -->


**🧪 Vite mode is experimental and many Nuxt modules are still incompatible. If you find a bug, please report via [issues](https://github.com/nuxt/vite/issues) with a minimal reproduction.**

💡 We are trying to make most modules and options work out-of-the-box. If you are a module maintainer,
 please see [this section](https://vite.nuxtjs.org/advanced/modules) for supporting Vite. If a module or feature is missing, feel free to open an issue.

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

That's it! Now you can enjoy a super fast `nuxt dev` experience with Vite!


**[📖 Read documentation for more](https://vite.nuxtjs.org)**

## ❤️ Credits

This module could not be possible without [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2) by [@underfin](https://github.com/underfin)

Published under MIT License
