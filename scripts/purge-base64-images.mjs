#!/usr/bin/env node
/**
 * Cleanup of legacy base64 / DB-stored images.
 *
 *  1. Clears any base64 `data:` URIs still sitting in projects.image / blogposts.coverImage
 *     (these were never valid Cloudinary URLs). They get reset to '' so the UI falls back
 *     to its placeholder until a real Cloudinary image is uploaded.
 *  2. Drops the orphaned `blogimages` collection — the old DB image store that predates
 *     the Cloudinary migration. Nothing references it anymore.
 *
 * Usage: node scripts/purge-base64-images.mjs
 *        node scripts/purge-base64-images.mjs --dry   (report only, no writes)
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import mongoose from 'mongoose'

const DRY = process.argv.includes('--dry')

// Load .env.local manually
try {
  const env = readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '')
  }
} catch {}

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI is missing.')
  process.exit(1)
}

await mongoose.connect(uri)
const db = mongoose.connection.db
console.log(`Connected.${DRY ? ' (dry run — no writes)' : ''}`)

// 1. Clear base64 data URIs from projects.image
const projects = db.collection('projects')
const projMatch = { image: { $regex: '^data:' } }
const projCount = await projects.countDocuments(projMatch)
if (!DRY && projCount) await projects.updateMany(projMatch, { $set: { image: '' } })
console.log(`  projects with base64 image: ${projCount}${DRY ? '' : ' cleared'}`)

// 2. Clear base64 data URIs from blogposts.coverImage
const blog = db.collection('blogposts')
const blogMatch = { coverImage: { $regex: '^data:' } }
const blogCount = await blog.countDocuments(blogMatch)
if (!DRY && blogCount) await blog.updateMany(blogMatch, { $set: { coverImage: '' } })
console.log(`  blogposts with base64 coverImage: ${blogCount}${DRY ? '' : ' cleared'}`)

// 3. Drop the orphaned blogimages collection (old DB image store)
const collections = await db.listCollections({ name: 'blogimages' }).toArray()
if (collections.length) {
  const imgCount = await db.collection('blogimages').countDocuments()
  if (!DRY) await db.collection('blogimages').drop()
  console.log(`  blogimages collection: ${imgCount} docs${DRY ? ' (would drop)' : ' dropped'}`)
} else {
  console.log('  blogimages collection: not present')
}

await mongoose.disconnect()
console.log('Done.')
