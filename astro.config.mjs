import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.wraithcheats.cc',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
