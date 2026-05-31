import type { MetadataRoute } from 'next'
import { getAllPosts } from '../lib/blog'

const SITE_URL = 'https://stint.digital'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,         lastModified: now, changeFrequency: 'weekly',  priority: 1 },
    { url: `${SITE_URL}/work`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/freelance`,lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${SITE_URL}/blog`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
  ]

  let blogPages: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts()
    blogPages = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch (err) {
    console.error('sitemap: failed to load blog posts', err)
  }

  return [...staticPages, ...blogPages]
}
