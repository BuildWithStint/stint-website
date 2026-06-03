import { v2 as cloudinary } from 'cloudinary'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dpmaptm4c'
const apiKey = process.env.CLOUDINARY_API_KEY || '168831167874946'
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET

if (!apiSecret) {
  console.warn(
    '[cloudinary] CLOUDINARY_API_SECRET is not set — uploads will fail until it is configured.'
  )
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
})

export { cloudinary }

export async function uploadImageBuffer(
  buffer: Buffer,
  contentType: string,
  folder: string
): Promise<{ url: string; publicId: string }> {
  const dataUri = `data:${contentType};base64,${buffer.toString('base64')}`
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    overwrite: false,
    transformation: [{ fetch_format: 'auto', quality: 'auto' }],
  })
  return { url: result.secure_url, publicId: result.public_id }
}
