import { NextResponse } from 'next/server'
import {
  withAuth,
  withDatabase,
  withCors,
  AuthenticatedRequest,
} from '../../../lib/middleware'
import { uploadImageBuffer } from '../../../lib/cloudinary'

const MAX_BYTES = 10 * 1024 * 1024 // 10MB
const ALLOWED_FOLDERS = new Set(['blog', 'projects', 'team'])

async function handler(req: AuthenticatedRequest) {
  try {
    if (!req.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const form = await req.formData()
    const file = form.get('file')
    const folderRaw = (form.get('folder') as string | null) || 'misc'
    const folder = ALLOWED_FOLDERS.has(folderRaw) ? `stint/${folderRaw}` : 'stint/misc'

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const blob = file as File
    if (!blob.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: `Unsupported type: ${blob.type}` },
        { status: 400 }
      )
    }
    if (blob.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File exceeds 10MB limit' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await blob.arrayBuffer())
    const { url, publicId } = await uploadImageBuffer(buffer, blob.type, folder)

    return NextResponse.json({ success: true, url, publicId })
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Upload failed' },
      { status: 500 }
    )
  }
}

export const POST = withCors(withDatabase(withAuth(handler)))
