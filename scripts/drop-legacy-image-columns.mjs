#!/usr/bin/env node
/**
 * One-shot cleanup:
 *  - Drops the temporary `imageUrl` / `coverImageUrl` columns (data is migrated back into `image` / `coverImage` if present).
 *  - Clears any leftover base64 data URIs from `image` / `coverImage` so old broken refs disappear.
 *
 * Usage: node scripts/drop-legacy-image-columns.mjs
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import mongoose from 'mongoose'

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

console.log('Connected. Cleaning collections…')

// 1. Projects: move imageUrl -> image (if image is empty or base64), then unset imageUrl.
const projects = db.collection('projects')
const projDocs = await projects.find({}).toArray()
for (const p of projDocs) {
  const set = {}
  const unset = {}
  const newUrl = typeof p.imageUrl === 'string' && p.imageUrl.startsWith('http') ? p.imageUrl : null
  const oldIsBase64 = typeof p.image === 'string' && p.image.startsWith('data:')
  if (newUrl) set.image = newUrl
  else if (oldIsBase64) set.image = ''
  unset.imageUrl = ''
  await projects.updateOne(
    { _id: p._id },
    { ...(Object.keys(set).length ? { $set: set } : {}), $unset: unset }
  )
}
console.log(`  projects: cleaned ${projDocs.length}`)

// 2. BlogPosts: same idea.
const blog = db.collection('blogposts')
const blogDocs = await blog.find({}).toArray()
for (const b of blogDocs) {
  const set = {}
  const unset = {}
  const newUrl = typeof b.coverImageUrl === 'string' && b.coverImageUrl.startsWith('http') ? b.coverImageUrl : null
  const oldIsBase64 = typeof b.coverImage === 'string' && b.coverImage.startsWith('data:')
  if (newUrl) set.coverImage = newUrl
  else if (oldIsBase64) set.coverImage = ''
  unset.coverImageUrl = ''
  await blog.updateOne(
    { _id: b._id },
    { ...(Object.keys(set).length ? { $set: set } : {}), $unset: unset }
  )
}
console.log(`  blogposts: cleaned ${blogDocs.length}`)

await mongoose.disconnect()
console.log('Done.')
