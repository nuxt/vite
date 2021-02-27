import type { InlineConfig } from 'vite'
import type { VueViteOptions } from 'vite-plugin-vue2'

export interface Nuxt {
  options: any;
  resolver: any;
  hook: Function;
  callHook: Function;
}

export interface ViteInlineConfig extends InlineConfig {
  vue?: VueViteOptions
}

export interface ViteBuildContext {
  nuxt: Nuxt;
  builder: {
    plugins: { name: string; mode?: 'client' | 'server'; src: string; }[];
  };
  config: ViteInlineConfig;
}
