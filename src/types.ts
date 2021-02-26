import { UserConfig } from 'vite'
import * as vite from 'vite'

export interface Nuxt {
  options: any;
  hook: Function;
  callHook: Function;
}

export interface ViteBuildContext {
  nuxt: Nuxt;
  builder: {
    plugins: { name: string; mode?: 'client' | 'server'; src: string; }[];
  };
  config: vite.InlineConfig;
}

declare module '@nuxt/types/config/index' {
  interface NuxtOptions {
    vite?: UserConfig
  }
}
