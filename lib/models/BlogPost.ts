import mongoose, { Document, Schema } from 'mongoose'

export interface IBlogPost extends Document {
  slug: string
  title: string
  description: string
  body: string // HTML
  coverImage?: string // Cloudinary URL
  tags: string[]
  keywords: string[]
  author: string
  readingTime: string
  isPublished: boolean
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 400 },
    body: { type: String, required: true },
    coverImage: { type: String, default: '' },
    tags: { type: [String], default: [] },
    keywords: { type: [String], default: [] },
    author: { type: String, default: 'STINT', trim: true },
    readingTime: { type: String, default: '5 min read', trim: true },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const BlogPost =
  (mongoose.models.BlogPost as mongoose.Model<IBlogPost>) ||
  mongoose.model<IBlogPost>('BlogPost', blogPostSchema)
