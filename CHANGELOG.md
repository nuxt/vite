# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
