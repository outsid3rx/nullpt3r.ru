import { defineCollection, z } from 'astro:content';

const fileAttachment = z.object({
  type: z.literal('file'),
  name: z.string(),
  url: z.string(),
  extension: z.string().optional(),
});

const linkAttachment = z.object({
  type: z.literal('link'),
  name: z.string(),
  url: z.string(),
});

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
      attachments: z
        .array(z.discriminatedUnion('type', [fileAttachment, linkAttachment]))
        .optional()
        .default([]),
    }),
});

export const collections = { posts };
