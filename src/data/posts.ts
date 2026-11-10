import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPublicPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.hidden);
  return posts.sort((a, b) => {
    const dateOrder = b.data.date.getTime() - a.data.date.getTime();
    if (dateOrder) return dateOrder;
    if (a.data.series && a.data.series === b.data.series) {
      return (b.data.seriesOrder ?? 0) - (a.data.seriesOrder ?? 0);
    }
    return a.data.title.localeCompare(b.data.title);
  });
}

export function formatPostDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC', ...options,
  }).format(date);
}

export function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function previewImage(body: string): { src: string; alt: string } | undefined {
  const match = body.match(/!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/);
  if (!match) return undefined;
  const source = match[2] ?? match[3];
  const publicAsset = source.match(/(?:^|\/)public\/(.+)$/);
  return { src: publicAsset ? `/${publicAsset[1]}` : source, alt: match[1] || 'Post preview' };
}
