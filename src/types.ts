import * as vite from 'vite'

export interface Nuxt {
  options: any;
  resolver: any;
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
