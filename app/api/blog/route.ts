import { NextRequest, NextResponse } from 'next/server'
import { BlogPost } from '../../../lib/models/BlogPost'
import {
  withAuth,
  withDatabase,
  withCors,
  AuthenticatedRequest,
} from '../../../lib/middleware'

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

async function listHandler(req: AuthenticatedRequest) {
  try {
    const docs = await BlogPost.find({}).sort({ publishedAt: -1 }).lean()
    return NextResponse.json({ success: true, posts: docs })
  } catch (error) {
    console.error('List blog posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createHandler(req: AuthenticatedRequest) {
  try {
    if (!req.user?.isSuperUser) {
      return NextResponse.json(
        { success: false, error: 'Super admin access required' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      body: postBody,
      coverImage,
      tags,
      keywords,
      author,
      readingTime,
      isPublished,
      slug: customSlug,
      publishedAt,
    } = body

    if (!title || !description || !postBody) {
      return NextResponse.json(
        { success: false, error: 'title, description, and body are required' },
        { status: 400 }
      )
    }

    const slug = slugify(customSlug || title)
    const existing = await BlogPost.findOne({ slug })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A post with this slug already exists' },
        { status: 409 }
      )
    }

    const post = await BlogPost.create({
      slug,
      title,
      description,
      body: postBody,
      coverImage: coverImage || '',
      tags: Array.isArray(tags) ? tags : [],
      keywords: Array.isArray(keywords) ? keywords : [],
      author: author || 'STINT',
      readingTime: readingTime || '5 min read',
      isPublished: isPublished !== false,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    })

    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error: any) {
    console.error('Create blog post error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export const GET = withCors(withDatabase(withAuth(listHandler)))
export const POST = withCors(withDatabase(withAuth(createHandler)))
