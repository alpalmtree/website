// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
   markdown: {
    shikiConfig: {
      theme: 'nord',
      transformers: [{
        code() {
          // For an easier implementation of the copy code button
          this.pre.properties['data-content'] = this.source;
          
        }
      }]
    },
  },
  integrations: [mdx()]
});