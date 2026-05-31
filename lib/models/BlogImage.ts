import mongoose, { Schema, Document } from 'mongoose'

export interface IBlogImage extends Document {
  data: Buffer
  contentType: string
  filename: string
  size: number
  createdAt: Date
}

const BlogImageSchema = new Schema<IBlogImage>(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, default: '' },
    size: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const BlogImage =
  (mongoose.models.BlogImage as mongoose.Model<IBlogImage>) ||
  mongoose.model<IBlogImage>('BlogImage', BlogImageSchema)
