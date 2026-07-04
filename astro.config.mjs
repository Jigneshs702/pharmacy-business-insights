import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to the custom domain once one is purchased.
export default defineConfig({
  site: 'https://pharmacy-business-insights.vercel.app',
  integrations: [sitemap({ filter: (page) => !page.includes('/previews/') })],
  trailingSlash: 'always',
});
