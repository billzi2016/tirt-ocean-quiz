import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://example.com',
  base: '/tirt-ocean-quiz',
  integrations: [tailwind()],
});
