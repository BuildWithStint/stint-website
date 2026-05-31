import { NextResponse } from 'next/server'
import { BlogImage } from '../../../../lib/models/BlogImage'
import {
  withAuth,
  withDatabase,
  withCors,
  AuthenticatedRequest,
} from '../../../../lib/middleware'

const MAX_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'])

async function uploadHandler(req: AuthenticatedRequest) {
  try {
    if (!req.user?.isSuperUser) {
      return NextResponse.json(
        { success: false, error: 'Super admin access required' },
        { status: 403 }
      )
    }

    const form = await req.formData()
    const file = form.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    const blob = file as File
    if (!ALLOWED.has(blob.type)) {
      return NextResponse.json(
        { success: false, error: `Unsupported type: ${blob.type}` },
        { status: 400 }
      )
    }
    if (blob.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File exceeds 5MB limit' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await blob.arrayBuffer())
    const doc = await BlogImage.create({
      data: buffer,
      contentType: blob.type,
      filename: blob.name || '',
      size: blob.size,
    })

    return NextResponse.json({
      success: true,
      id: doc._id.toString(),
      url: `/api/blog/images/${doc._id.toString()}`,
    })
  } catch (error) {
    console.error('Blog image upload error:', error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}

export const POST = withCors(withDatabase(withAuth(uploadHandler)))
