import { createHash } from 'crypto'

export function uniq<T> (arr: T[]): T[] {
  return Array.from(new Set(arr))
}

// Copied from vue-bundle-renderer utils
const IS_JS_RE = /\.[cm]?js(\?[^.]+)?$/
const IS_MODULE_RE = /\.mjs(\?[^.]+)?$/
const HAS_EXT_RE = /[^./]+\.[^./]+$/
const IS_CSS_RE = /\.css(\?[^.]+)?$/
const IS_DEV_CSS_RE = /\.(?:css|scss|sass|postcss|stylus|styl)(\?[^.]+)?$/

export function isJS (file: string) {
  return IS_JS_RE.test(file) || !HAS_EXT_RE.test(file)
}

export function isModule (file: string) {
  return IS_MODULE_RE.test(file) || !HAS_EXT_RE.test(file)
}

export function isCSS (file: string) {
  return IS_CSS_RE.test(file)
}

export function isDevCSS (file: string) {
  return IS_DEV_CSS_RE.test(file)
}

export function rewriteDevCSS (file:string) {
  if (file.endsWith('.css')) { return }
  if (file.includes('?')) { return file + '&mock.css' }
  return file + '?mock.css'
}

export function hashId (id: string) {
  return '$id_' + hash(id)
}

export function hash (input: string, length = 8) {
  return createHash('sha256')
    .update(input)
    .digest('hex')
    .substr(0, length)
}
