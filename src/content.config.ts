import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    categoryTitle: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .optional(),
    cta: z
      .object({
        heading: z.string(),
        text: z.string(),
        href: z.string(),
        button: z.string(),
      })
      .optional(),
  }),
});

export const collections = { articles };
