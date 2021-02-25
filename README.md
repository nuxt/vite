# nuxt-vite

Vite Experience for Nuxt2!

## What is working?

**NOTE:** This is an experimental package. Please do not consider for production!

- [x] Using vite in development
- [x] Basic server-side rendering

## Usage

Install package:

```sh
yarn add --dev nuxt-vite
# or
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

Nuxt uses an internal hooking system and abstracted bundler ([@nuxt/webpack](https://github.com/nuxt/nuxt.js/tree/dev/packages/webpack)).
Vite module, replaces webpack by a similar interface to use vite.

Client-side modules are loaded on demand using vite middleware

Server-side bundle is bundled by a second vite instance and written to filesystem and passed using hooks to nuxt server-renderer.
Currently approach is not most efficient due to usage of filesystem, extra build and lack of lazy loading.
Yet much faster than webpack builds. You can opt-out SSR build using `nuxt dev --spa`

## License

MIT - Pooya Parsa
