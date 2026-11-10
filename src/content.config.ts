import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().default(''),
    hidden: z.boolean().default(false),
    series: z.string().optional(),
    seriesOrder: z.coerce.number().optional(),
  }),
});

export const collections = { posts };
