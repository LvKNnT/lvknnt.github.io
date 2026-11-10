import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import rehypeMathjax from 'rehype-mathjax/svg';
import remarkMath from 'remark-math';

export default defineConfig({
  site: 'https://lvknnt.github.io',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeMathjax],
    }),
  },
});
