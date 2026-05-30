import type { MetadataRoute } from 'next'

const SITE_URL = 'https://stint.digital'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}
