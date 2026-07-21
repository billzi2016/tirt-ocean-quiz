import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://billzi2016.github.io',
  base: '/tirt-ocean-quiz',
  integrations: [tailwind()],
});
