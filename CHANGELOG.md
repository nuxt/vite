# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.4](https://github.com/nuxt/vite/compare/v0.3.3...v0.3.4) (2021-10-02)


### Bug Fixes

* rewrite /_nuxt/ to /.nuxt/ ([#214](https://github.com/nuxt/vite/issues/214)) ([c297551](https://github.com/nuxt/vite/commit/c297551b5e6904332fa1bdc438dcca5b2153857b))

### [0.3.3](https://github.com/nuxt/vite/compare/v0.3.2...v0.3.3) (2021-10-02)


### Bug Fixes

* add `_nuxt` alias to buildDir (resolves [#214](https://github.com/nuxt/vite/issues/214)) ([03d29b4](https://github.com/nuxt/vite/commit/03d29b48f397ba977db2b44967ecdd80e5f7876a))

### [0.3.2](https://github.com/nuxt/vite/compare/v0.3.1...v0.3.2) (2021-10-02)


### Bug Fixes

* inline p-debounce ([f9636ab](https://github.com/nuxt/vite/commit/f9636ab078c1c5a31e362771ce22fb6d3eb53bcf))
* **pkg:** add missing defu dependency ([1ec96c7](https://github.com/nuxt/vite/commit/1ec96c7e8eca0f270b3b9f7bf54e56ef92339cf2))
* use pathe ([9af7c3a](https://github.com/nuxt/vite/commit/9af7c3a3228804692e4430e144b2b5659dc8449b))

### [0.3.1](https://github.com/nuxt/vite/compare/v0.3.0...v0.3.1) (2021-10-01)


### Bug Fixes

* improve vite ssr import cache ([#210](https://github.com/nuxt/vite/issues/210)) ([e8b43dc](https://github.com/nuxt/vite/commit/e8b43dcbccc3a7293c14579e40ba1cdd5ba90c4e))

## [0.3.0](https://github.com/nuxt/vite/compare/v0.2.4...v0.3.0) (2021-09-30)


### Features

* build dev server bundle using vite  ([#201](https://github.com/nuxt/vite/issues/201)) ([547ceb4](https://github.com/nuxt/vite/commit/547ceb4734fb47631783807d0f0704a1a43df72e))


### Bug Fixes

* mock whatwg-url ([c0e051f](https://github.com/nuxt/vite/commit/c0e051f371b35ef47a7f3796c04f621bde043afe))
* remove `/@id/` from defaultexport-handled ids ([#208](https://github.com/nuxt/vite/issues/208)) ([35a7ae6](https://github.com/nuxt/vite/commit/35a7ae600d03d2dd4553be25b43752dab5267c15))

### [0.2.4](https://github.com/nuxt/vite/compare/v0.2.3...v0.2.4) (2021-09-07)

### [0.2.3](https://github.com/nuxt/vite/compare/v0.2.2...v0.2.3) (2021-09-07)


### Bug Fixes

* dev ssr style fouc ([#195](https://github.com/nuxt/vite/issues/195)) ([8219dab](https://github.com/nuxt/vite/commit/8219dab808bf8ec36dd97641274c0f92b149d6d9))
* **types:** allow `vite.ssr` to be true ([b6d3824](https://github.com/nuxt/vite/commit/b6d3824a38311aff903c945402baf1448670e0ae))

### [0.2.2](https://github.com/nuxt/vite/compare/v0.2.1...v0.2.2) (2021-09-01)

### [0.2.1](https://github.com/nuxt/vite/compare/v0.2.0...v0.2.1) (2021-08-25)


### Bug Fixes

* missing imports ([abb6ded](https://github.com/nuxt/vite/commit/abb6ded01a54d236646c03cc2108ba16d0cefec7))

## [0.2.0](https://github.com/nuxt/vite/compare/v0.1.3...v0.2.0) (2021-08-25)


### ⚠ BREAKING CHANGES

* change vite root to `rootDir` from `buildDir` (#184)

### Features

* production build with vite ([#179](https://github.com/nuxt/vite/issues/179)) ([19bf4b2](https://github.com/nuxt/vite/commit/19bf4b2540557a62f0ec5fcc26db922915bc748f))
* use vite watcher for server bundle ([#180](https://github.com/nuxt/vite/issues/180)) ([b933033](https://github.com/nuxt/vite/commit/b9330338fd4ef64c94cf28bfec828d091c13bbed))


### Bug Fixes

* change vite root to `rootDir` from `buildDir` ([#184](https://github.com/nuxt/vite/issues/184)) ([6e14fbb](https://github.com/nuxt/vite/commit/6e14fbb008ad89427da2344c97120cd00b875001))
* use `static` as publicDir for vite ([#183](https://github.com/nuxt/vite/issues/183)) ([1d91ed5](https://github.com/nuxt/vite/commit/1d91ed5f1bbc467e483821db0ad9dc129809d1b3))

### [0.1.3](https://github.com/nuxt/vite/compare/v0.1.2...v0.1.3) (2021-08-15)


### Bug Fixes

* hide warm-up errors ([#168](https://github.com/nuxt/vite/issues/168)) ([864f156](https://github.com/nuxt/vite/commit/864f15617a313e78bbc2604fa95677f5411dcaa2))
* invalid version when containing a - ([#177](https://github.com/nuxt/vite/issues/177)) ([b650320](https://github.com/nuxt/vite/commit/b650320e2bf75615d9ec40a46eb3b7f133c41038))

### [0.1.2](https://github.com/nuxt/vite/compare/v0.1.1...v0.1.2) (2021-08-12)


### Bug Fixes

* vite fs strict ([d9eba76](https://github.com/nuxt/vite/commit/d9eba76013bce86f6583ff1848f9abeb155b2910))

### [0.1.1](https://github.com/nuxt/vite/compare/v0.1.0...v0.1.1) (2021-05-25)


### Features

* vite 2.3 ([#138](https://github.com/nuxt/vite/issues/138)) ([3a045d9](https://github.com/nuxt/vite/commit/3a045d986ffc674f8077115a77b667b759dbfb76))

## [0.1.0](https://github.com/nuxt/vite/compare/v0.0.39...v0.1.0) (2021-05-12)


### ⚠ BREAKING CHANGES

* disable ssr by default (#139)

### Features

* disable ssr by default ([#139](https://github.com/nuxt/vite/issues/139)) ([5de0470](https://github.com/nuxt/vite/commit/5de04702997ea82da889bea8185891a0ce177466))


### Bug Fixes

* **server:** add `build.transpile` to `ssr.noExternal` ([441cf6c](https://github.com/nuxt/vite/commit/441cf6cadd7ae97fcdabd0d9318a23b280505eb5))

### [0.0.39](https://github.com/nuxt/vite/compare/v0.0.38...v0.0.39) (2021-05-12)


### Bug Fixes

* add explicit mjs from require.resolve ([d5798a5](https://github.com/nuxt/vite/commit/d5798a57f058b097a3b569213ac4ce44abb8884b))
* use mjs for templates ([0cd6848](https://github.com/nuxt/vite/commit/0cd68489de61f477f911dee60aa08a28deadbe52)), closes [#137](https://github.com/nuxt/vite/issues/137)

### [0.0.38](https://github.com/nuxt/vite/compare/v0.0.37...v0.0.38) (2021-05-11)

### [0.0.37](https://github.com/nuxt/vite/compare/v0.0.36...v0.0.37) (2021-04-21)

### [0.0.36](https://github.com/nuxt/vite/compare/v0.0.35...v0.0.36) (2021-03-13)

### [0.0.35](https://github.com/nuxt/vite/compare/v0.0.34...v0.0.35) (2021-03-13)


### Features

* eagerly warm up cache for client entry ([#99](https://github.com/nuxt/vite/issues/99)) ([8070240](https://github.com/nuxt/vite/commit/807024091b9acaedda92fa55a628ce229824c963))

### [0.0.34](https://github.com/nuxt/vite/compare/v0.0.33...v0.0.34) (2021-03-12)


### Bug Fixes

* set process.dev ([#100](https://github.com/nuxt/vite/issues/100)) ([ea12663](https://github.com/nuxt/vite/commit/ea12663a8de4470fdb407338a23f6ff97006b0cc))

### [0.0.33](https://github.com/nuxt/vite/compare/v0.0.32...v0.0.33) (2021-03-12)


### Features

* jsx transform support (without h) ([#94](https://github.com/nuxt/vite/issues/94)) ([819ba23](https://github.com/nuxt/vite/commit/819ba23741e9b2d4ebcee0f24552ad18ed7072c5))


### Bug Fixes

* support custom `app.html` ([#97](https://github.com/nuxt/vite/issues/97)) ([d5aa6b6](https://github.com/nuxt/vite/commit/d5aa6b61fd9fe83ac9d2fa5a79d91f37c8654d41)), closes [#96](https://github.com/nuxt/vite/issues/96)

### [0.0.32](https://github.com/nuxt/vite/compare/v0.0.31...v0.0.32) (2021-03-10)

### [0.0.31](https://github.com/nuxt/vite/compare/v0.0.30...v0.0.31) (2021-03-10)


### Features

* improve server rebuild experience ([c308fc2](https://github.com/nuxt/vite/commit/c308fc25a7bce74d1ff66f898e09951561d55c83))

### [0.0.30](https://github.com/nuxt/vite/compare/v0.0.29...v0.0.30) (2021-03-10)


### Features

* mask nuxt-vite from buildModules ([ad46140](https://github.com/nuxt/vite/commit/ad46140f7139ffba84e148034d485b3837c2a552))

### [0.0.29](https://github.com/nuxt/vite/compare/v0.0.28...v0.0.29) (2021-03-09)


### Bug Fixes

* **server:** safe replacement for client globals (resolves [#73](https://github.com/nuxt/vite/issues/73)) ([37c41af](https://github.com/nuxt/vite/commit/37c41af66a9489dc4b4f275657fcb55cf1cf7cb3))

### [0.0.28](https://github.com/nuxt/vite/compare/v0.0.27...v0.0.28) (2021-03-02)


### Features

* support postcss and tailwindcss ([5298c6b](https://github.com/nuxt/vite/commit/5298c6b05aec27dc527db69f203bb2510d4b4073))

### [0.0.27](https://github.com/nuxt/vite/compare/v0.0.26...v0.0.27) (2021-03-02)


### Bug Fixes

* use mkdirpSync for client dir ([74639a6](https://github.com/nuxt/vite/commit/74639a65725216257d399aa65d88b5395e9250ff))

### [0.0.26](https://github.com/nuxt/vite/compare/v0.0.25...v0.0.26) (2021-03-02)


### Bug Fixes

* add missing ssr type for vite ([0fddc94](https://github.com/nuxt/vite/commit/0fddc9479999d35521d9d5a46aa0ee2752b1dda5))
* force externalize axios for server ([61aa83b](https://github.com/nuxt/vite/commit/61aa83bb744978146cbe1caf9b31ad82d645c55a))

### [0.0.25](https://github.com/nuxt/vite/compare/v0.0.24...v0.0.25) (2021-03-02)


### Bug Fixes

* set common browser globals to undefined for server ([43a19e3](https://github.com/nuxt/vite/commit/43a19e3dd706453183be64d95fd5f0c56fe3aefd))

### [0.0.24](https://github.com/nuxt/vite/compare/v0.0.23...v0.0.24) (2021-03-02)


### Bug Fixes

* use named import for semver ([6253565](https://github.com/nuxt/vite/commit/62535654e52cbbc445bdffc2e02726f8ad0e1c28))
* **pkg:** add missing consola dependency ([913a83b](https://github.com/nuxt/vite/commit/913a83babc1ddd85c4a80e290f0e3d177a376823))

### [0.0.23](https://github.com/nuxt/vite/compare/v0.0.22...v0.0.23) (2021-03-02)


### Features

* basic jsx support (closes [#63](https://github.com/nuxt/vite/issues/63)) ([c689879](https://github.com/nuxt/vite/commit/c68987922f9e0a9191ced0b95371c9afce7cb77d))

### [0.0.22](https://github.com/nuxt/vite/compare/v0.0.21...v0.0.22) (2021-03-01)


### Bug Fixes

* exclude nanoid from cache ([e8f14b8](https://github.com/nuxt/vite/commit/e8f14b8a562d7947c4df90f5a9ad30d690cf644f))

### [0.0.21](https://github.com/nuxt/vite/compare/v0.0.20...v0.0.21) (2021-03-01)


### Bug Fixes

* add hotix for i18n module (resolves [#58](https://github.com/nuxt/vite/issues/58)) ([434c7c2](https://github.com/nuxt/vite/commit/434c7c2080fc4bb78750fe47d4704a20da7f019c))

### [0.0.20](https://github.com/nuxt/vite/compare/v0.0.19...v0.0.20) (2021-02-28)


### Features

* support vite:extend and vite:extendConfig hooks (closes [#4](https://github.com/nuxt/vite/issues/4)) ([8f81d17](https://github.com/nuxt/vite/commit/8f81d17167602cf43bacec5791f14a273fb5e4d3))

### [0.0.19](https://github.com/nuxt/vite/compare/v0.0.18...v0.0.19) (2021-02-28)


### Bug Fixes

* exclude ufo and date-fns from optimize deps (fixes [#51](https://github.com/nuxt/vite/issues/51)) ([3fa8059](https://github.com/nuxt/vite/commit/3fa805948338a559e47640fa465d5884e51518ea))

### [0.0.18](https://github.com/nuxt/vite/compare/v0.0.17...v0.0.18) (2021-02-27)

### [0.0.17](https://github.com/nuxt/vite/compare/v0.0.16...v0.0.17) (2021-02-27)


### Bug Fixes

* **pkg:** copy runtime deps ([fb2fdf2](https://github.com/nuxt/vite/commit/fb2fdf20c90717e872f027d32e3bcc53b136b18b))

### [0.0.16](https://github.com/nuxt/vite/compare/v0.0.15...v0.0.16) (2021-02-27)


### Features

* add version to banner ([4ac19d6](https://github.com/nuxt/vite/commit/4ac19d6d69ca261dbc5216d8f2b2b5ea02b34032))

### [0.0.15](https://github.com/nuxt/vite/compare/v0.0.14...v0.0.15) (2021-02-27)


### Features

* support http module ([#42](https://github.com/nuxt/vite/issues/42)) ([a75ff05](https://github.com/nuxt/vite/commit/a75ff0538e3fa09b7fd1ce3bf573d3c6233d4e28))
* support vite.vue options, close [#43](https://github.com/nuxt/vite/issues/43) ([#44](https://github.com/nuxt/vite/issues/44)) ([687f778](https://github.com/nuxt/vite/commit/687f778f25f2e3d5db8e65b5e17eefacc7a6ef77))


### Bug Fixes

* store root state (fixes [#45](https://github.com/nuxt/vite/issues/45)) ([b73a90e](https://github.com/nuxt/vite/commit/b73a90e7383b80c138b940fc1bdfbf7e244f4d3a))

### [0.0.14](https://github.com/nuxt/vite/compare/v0.0.13...v0.0.14) (2021-02-27)


### Bug Fixes

* another attempt to fix temp dir error ([ee6bb27](https://github.com/nuxt/vite/commit/ee6bb274bbe6842da5d369804a4a67b50c51b8b2))
* use vite fork to addreess [#2](https://github.com/nuxt/vite/issues/2) vitejs/vite[#2299](https://github.com/nuxt/vite/issues/2299) ([d9d86d7](https://github.com/nuxt/vite/commit/d9d86d7b241ff23fcf22559c6f900fcd8d2a5d9a))

### [0.0.13](https://github.com/nuxt/vite/compare/v0.0.12...v0.0.13) (2021-02-27)


### Bug Fixes

* change vite cache dir ([fbd7ed0](https://github.com/nuxt/vite/commit/fbd7ed0f2708cb3f9ab67ff83d7e5ca0057f6984))
* hash imports (fixes [#36](https://github.com/nuxt/vite/issues/36)) ([993498a](https://github.com/nuxt/vite/commit/993498ae3842bd255feac53236dcdecb7698eb9d))

### [0.0.12](https://github.com/nuxt/vite/compare/v0.0.11...v0.0.12) (2021-02-27)


### Bug Fixes

* conditionally add store template ([e6a5272](https://github.com/nuxt/vite/commit/e6a52723b379a63379226a9a85491823fc9cf44b))

### [0.0.11](https://github.com/nuxt/vite/compare/v0.0.10...v0.0.11) (2021-02-27)


### Bug Fixes

* handle empty store/middleware ([0e7c3ae](https://github.com/nuxt/vite/commit/0e7c3ae0994b8b80c29d3e005687c9d643f6f62e))

### [0.0.10](https://github.com/nuxt/vite/compare/v0.0.9...v0.0.10) (2021-02-27)


### Bug Fixes

*  avoid using \0 for virtual deps (fixes [#33](https://github.com/nuxt/vite/issues/33)) ([3220069](https://github.com/nuxt/vite/commit/3220069acf2249ef5b9cc3ca3b4245dc57caabc0))

### [0.0.9](https://github.com/nuxt/vite/compare/v0.0.8...v0.0.9) (2021-02-27)


### Features

* add version and experimental warnings ([d80c7fc](https://github.com/nuxt/vite/commit/d80c7fc45b557c07c2e2c866b225363c64f96301))
* support page middleware ([9e50817](https://github.com/nuxt/vite/commit/9e508175c3b79706ea487259c11139434de97d5c))
* support store ([69e6148](https://github.com/nuxt/vite/commit/69e61489a72f673f9197d72aafdf89d876b7ea83))


### Bug Fixes

* debounce server rebuilds ([c8b5e04](https://github.com/nuxt/vite/commit/c8b5e04d48a7d2789b04c97ef22d3420a1d88c5f))
* **pkg:** add ufo dependency (closes [#32](https://github.com/nuxt/vite/issues/32)) ([0da46ae](https://github.com/nuxt/vite/commit/0da46aeded5fe7b5251f152313ad5eba6aa54581))
* create extra temp directory in cache ([b8bc156](https://github.com/nuxt/vite/commit/b8bc1564e004645abc202a12da34a11d93f33e46))
* hide unused external warning (closes [#22](https://github.com/nuxt/vite/issues/22)) ([b039e77](https://github.com/nuxt/vite/commit/b039e777be5369c8898bb75655292ac5cb06ac5a))

### [0.0.8](https://github.com/nuxt/vite/compare/v0.0.7...v0.0.8) (2021-02-27)


### Bug Fixes

* fix cacheDir overriding issue ([#2](https://github.com/nuxt/vite/issues/2)) ([ff92525](https://github.com/nuxt/vite/commit/ff92525f41f59a72979f28580c67741a3d841fc8))
* workaround for mjs cache ([a99df37](https://github.com/nuxt/vite/commit/a99df3797979ac49a2a012e9836aa851f1a80d2e))

### [0.0.7](https://github.com/nuxt/vite/compare/v0.0.6...v0.0.7) (2021-02-26)


### Bug Fixes

* avoid mutating resolved config ([d9e206e](https://github.com/nuxt/vite/commit/d9e206eee0fac91bb0d54b704ad52c599d4d8f38)), closes [#404](https://github.com/nuxt/vite/issues/404)

### [0.0.6](https://github.com/nuxt/vite/compare/v0.0.5...v0.0.6) (2021-02-26)


### Bug Fixes

* allow importing plugins without extension ([f00320d](https://github.com/nuxt/vite/commit/f00320db8b888e34c5f7f06ed89ee4193b41d559))

### [0.0.5](https://github.com/nuxt/vite/compare/v0.0.4...v0.0.5) (2021-02-26)


### Bug Fixes

* fix issues with default-export plugin ([cbd52d7](https://github.com/nuxt/vite/commit/cbd52d7e934df579c71e19e9f965e91512aca8b7))
* support plugins without default export ([#20](https://github.com/nuxt/vite/issues/20)) ([fdce8d0](https://github.com/nuxt/vite/commit/fdce8d0b753c819413ed593d83e25c35b597c20b))
* use additional load for default export (fixes [#20](https://github.com/nuxt/vite/issues/20)) ([98983c8](https://github.com/nuxt/vite/commit/98983c8f357a8d0f4af786c7c5b884189074e2bd))

### [0.0.4](https://github.com/nuxt/vite/compare/v0.0.3...v0.0.4) (2021-02-26)


### Features

* support vite option ([#19](https://github.com/nuxt/vite/issues/19)) ([e0b2a86](https://github.com/nuxt/vite/commit/e0b2a86baab62eeca0e2bd1962a2e3b57a7923f8))


### Bug Fixes

* use rootDir for vite cache directory (fixes [#2](https://github.com/nuxt/vite/issues/2)) ([2f2cd4c](https://github.com/nuxt/vite/commit/2f2cd4c3b3e0bbf804af8b3da72da65bf0d59de4))

### [0.0.3](https://github.com/nuxt/vite/compare/v0.0.2...v0.0.3) (2021-02-25)


### Features

* support alias and plugins (resolves [#3](https://github.com/nuxt/vite/issues/3)) ([21c1e61](https://github.com/nuxt/vite/commit/21c1e61089079c35383f6ebf918359a1b9256d0c))

### [0.0.2](https://github.com/nuxt/vite/compare/v0.0.1...v0.0.2) (2021-02-25)


### Bug Fixes

* **pkg:** move chokidar to dependencies ([fd69064](https://github.com/nuxt/vite/commit/fd6906445a83372e24d970fc1284b950a16fda1d))

### 0.0.1 (2021-02-25)
