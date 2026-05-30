// One-shot migration: backfill approvedBy on all currently-visible reviews
// to the default super-admin so existing public reviews keep showing.
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs'

const env = readFileSync('.env.local', 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}

const FeedbackSchema = new mongoose.Schema({
  isVisible: Boolean,
  createdBy: mongoose.Schema.Types.ObjectId,
  approvedBy: mongoose.Schema.Types.ObjectId,
}, { timestamps: true, strict: false })

const UserSchema = new mongoose.Schema({ email: String, isSuperUser: Boolean }, { timestamps: true })

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing')
  await mongoose.connect(process.env.MONGODB_URI)
  const User = mongoose.models.User || mongoose.model('User', UserSchema)
  const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema)

  const superAdmin = await User.findOne({ email: 'admin@stint.com', isSuperUser: true })
  if (!superAdmin) throw new Error('Super admin admin@stint.com not found')

  const res = await Feedback.updateMany(
    { isVisible: true, $or: [{ approvedBy: { $exists: false } }, { approvedBy: null }] },
    { $set: { approvedBy: superAdmin._id } }
  )
  console.log(`Backfilled approvedBy on ${res.modifiedCount} visible feedback document(s).`)
  await mongoose.disconnect()
}

main().catch(err => { console.error(err); process.exit(1) })
