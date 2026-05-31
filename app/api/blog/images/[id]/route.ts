import { NextRequest, NextResponse } from 'next/server'
import { BlogImage } from '../../../../../lib/models/BlogImage'
import { connectDatabase } from '../../../../../lib/database'

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params
    if (!/^[a-f0-9]{24}$/i.test(id)) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 })
    }

    await connectDatabase()

    const doc = await BlogImage.findById(id).lean<{
      data: Buffer
      contentType: string
    } | null>()

    if (!doc) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return new NextResponse(new Uint8Array(doc.data), {
      status: 200,
      headers: {
        'Content-Type': doc.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Blog image fetch error:', error)
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}
