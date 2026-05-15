import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(200),
      description: z.string().min(1).max(500),
      heroImage: image().optional(),
      publishedAt: z.date(),
      tags: z.array(z.string()).min(1).max(10),
      draft: z.boolean().default(false),
      author: z.string().default('Никита Поляков'),
      authorAvatar: image().optional(),
    }),
});

export const collections = { posts };
