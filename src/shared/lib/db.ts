import type { CollectionEntry } from 'astro:content';

export function postSlug(post: CollectionEntry<'posts'>): string {
  return post.id.replace(/\.(md|mdx)$/, '');
}
