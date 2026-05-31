import { connectDatabase } from './database'
import { BlogPost, type IBlogPost } from './models/BlogPost'

export interface PublicBlogPost {
  slug: string
  title: string
  description: string
  body: string
  coverImage: string
  tags: string[]
  keywords: string[]
  author: string
  readingTime: string
  publishedAt: string
}

function serialize(doc: IBlogPost): PublicBlogPost {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    body: doc.body,
    coverImage: doc.coverImage ?? '',
    tags: doc.tags ?? [],
    keywords: doc.keywords ?? [],
    author: doc.author,
    readingTime: doc.readingTime,
    publishedAt: doc.publishedAt.toISOString(),
  }
}

export async function getAllPosts(): Promise<PublicBlogPost[]> {
  await connectDatabase()
  const docs = await BlogPost.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .lean<IBlogPost[]>()
    .exec()
  return docs.map((d) => serialize(d as IBlogPost))
}

export async function getPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  await connectDatabase()
  const doc = await BlogPost.findOne({ slug, isPublished: true }).lean<IBlogPost>().exec()
  return doc ? serialize(doc as IBlogPost) : null
}

export async function getAllSlugs(): Promise<string[]> {
  await connectDatabase()
  const docs = await BlogPost.find({ isPublished: true }, { slug: 1 }).lean<{ slug: string }[]>().exec()
  return docs.map((d) => d.slug)
}
