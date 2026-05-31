import { NextRequest, NextResponse } from 'next/server'
import { BlogPost } from '../../../../lib/models/BlogPost'
import {
  withAuth,
  withDatabase,
  withCors,
  AuthenticatedRequest,
} from '../../../../lib/middleware'

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function idFromUrl(url: string) {
  return new URL(url).pathname.split('/').pop()
}

async function getHandler(req: AuthenticatedRequest) {
  try {
    const id = idFromUrl(req.url)
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }
    const post = await BlogPost.findById(id).lean()
    if (!post) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Get blog post error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

async function updateHandler(req: AuthenticatedRequest) {
  try {
    if (!req.user?.isSuperUser) {
      return NextResponse.json(
        { success: false, error: 'Super admin access required' },
        { status: 403 }
      )
    }

    const id = idFromUrl(req.url)
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    const update = await req.json()
    if (update.slug) update.slug = slugify(update.slug)
    if (update.publishedAt) update.publishedAt = new Date(update.publishedAt)

    if (update.slug) {
      const conflict = await BlogPost.findOne({ slug: update.slug, _id: { $ne: id } })
      if (conflict) {
        return NextResponse.json(
          { success: false, error: 'Another post already uses this slug' },
          { status: 409 }
        )
      }
    }

    const post = await BlogPost.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean()

    if (!post) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, post })
  } catch (error: any) {
    console.error('Update blog post error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

async function deleteHandler(req: AuthenticatedRequest) {
  try {
    if (!req.user?.isSuperUser) {
      return NextResponse.json(
        { success: false, error: 'Super admin access required' },
        { status: 403 }
      )
    }
    const id = idFromUrl(req.url)
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }
    const post = await BlogPost.findByIdAndDelete(id)
    if (!post) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete blog post error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export const GET = withCors(withDatabase(withAuth(getHandler)))
export const PUT = withCors(withDatabase(withAuth(updateHandler)))
export const DELETE = withCors(withDatabase(withAuth(deleteHandler)))
