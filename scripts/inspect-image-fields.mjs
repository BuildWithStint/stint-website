// Inspect how images are stored in the DB for projects and blog posts.
// Usage: node scripts/inspect-image-fields.mjs
import fs from 'node:fs'
import path from 'node:path'
import mongoose from 'mongoose'

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local')
const env = fs.readFileSync(envPath, 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

function classify(val) {
  if (val === undefined || val === null) return 'missing'
  if (val === '') return 'empty'
  if (typeof val !== 'string') return `non-string(${typeof val})`
  if (val.startsWith('data:')) return `base64 (${Math.round(val.length / 1024)}KB)`
  if (/res\.cloudinary\.com/.test(val)) return 'cloudinary'
  if (val.startsWith('http')) return 'http url'
  if (val.startsWith('/')) return 'local path'
  return `other (${val.slice(0, 40)}…)`
}

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  const db = mongoose.connection.db

  for (const [coll, field] of [['projects', 'image'], ['blogposts', 'coverImage']]) {
    const docs = await db.collection(coll).find({}).toArray()
    console.log(`\n=== ${coll} (${docs.length} docs) — field "${field}" ===`)
    const tally = {}
    for (const d of docs) {
      const kind = classify(d[field])
      const bucket = kind.split(' (')[0]
      tally[bucket] = (tally[bucket] || 0) + 1
      console.log(`  - ${String(d.title || d._id).slice(0, 40).padEnd(42)} ${kind}`)
    }
    console.log('  totals:', tally)
  }

  await mongoose.disconnect()
  console.log('\nDone.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
