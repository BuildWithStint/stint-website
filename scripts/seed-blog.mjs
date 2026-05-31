// Seed the BlogPost collection with the initial STINT articles.
// Run with: node scripts/seed-blog.mjs
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs'

const env = readFileSync('.env.local', 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}

const BlogPostSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    title: String,
    description: String,
    body: String,
    keywords: [String],
    author: { type: String, default: 'STINT' },
    readingTime: String,
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
)

const POSTS = [
  {
    slug: 'how-to-hire-freelance-nextjs-developers',
    title: 'How to Hire Freelance Next.js Developers in 2026',
    description:
      'A practical guide for founders and product leads on hiring freelance Next.js developers — what to screen for, what to pay, and how to scope the first engagement.',
    keywords: [
      'hire freelance Next.js developers',
      'freelance Next.js developers',
      'hire Next.js developers',
      'freelance React developers',
      'hire freelance developers',
    ],
    readingTime: '8 min read',
    publishedAt: new Date('2026-06-01'),
    body: `
<p>Hiring a freelance Next.js developer in 2026 is easier than ever — and harder than ever to get right. The talent pool has tripled since the App Router landed, but so has the noise. This guide is the checklist we wish more founders ran through before signing a contract.</p>

<h2>Why freelance Next.js developers, specifically</h2>
<p>Next.js has quietly become the default React framework for production web apps. If your product is a marketing site, a SaaS dashboard, a commerce front, or a content-heavy platform, you probably need someone who understands the App Router, server components, streaming, and edge rendering — not a generic React contractor who'll bolt SSR on later.</p>
<p>A senior freelance <a href="/services">Next.js developer</a> brings two things an agency rarely matches: direct ownership of the code and a faster decision loop. You talk to the person who ships, not an account manager.</p>

<h2>What "senior" actually means here</h2>
<p>Years of experience is a weak signal. Look for these instead:</p>
<ul>
  <li><strong>Has shipped App Router in production.</strong> Not a tutorial rebuild — a real product with auth, payments, and revalidation.</li>
  <li><strong>Can explain server vs client components</strong> without reaching for the docs. Bonus if they have an opinion on when to use server actions vs route handlers.</li>
  <li><strong>Has opinions on data fetching.</strong> SWR, React Query, fetch caching, ISR — they should know the trade-offs by feel.</li>
  <li><strong>Understands Core Web Vitals.</strong> If they can't tell you what their last project's LCP was, they didn't measure it.</li>
  <li><strong>Reads commits, not just tickets.</strong> Senior people leave a clean git history.</li>
</ul>

<h2>The 30-minute screening call</h2>
<p>You don't need a four-round interview to hire a freelancer. You need thirty focused minutes:</p>
<ol>
  <li><strong>5 min — Their last shipped Next.js project.</strong> Get the URL. Open Lighthouse on it while they talk.</li>
  <li><strong>10 min — Architecture walkthrough.</strong> Ask them to draw the data flow for one feature. Vague hand-waves are a red flag.</li>
  <li><strong>5 min — A real bug they hit.</strong> What broke, how they found it, what they changed. This separates engineers from coders.</li>
  <li><strong>5 min — Your project, in their words.</strong> Can they paraphrase what you need without you correcting them?</li>
  <li><strong>5 min — Rate, availability, NDA.</strong> Get the uncomfortable stuff out of the way.</li>
</ol>

<h2>What you should be paying</h2>
<p>Rates vary wildly by geography and reputation, but for a senior freelance Next.js developer in 2026 the rough bands are:</p>
<ul>
  <li><strong>$45–80/hr</strong> — solid mid-level in Eastern Europe, South Asia, LATAM.</li>
  <li><strong>$80–150/hr</strong> — senior, English-fluent, async-first.</li>
  <li><strong>$150–250/hr</strong> — staff-level, niche expertise (perf, edge, AI).</li>
</ul>
<p>Project pricing is usually a better deal for both sides on scopes under twelve weeks. A fixed quote forces the conversation about what's actually in scope.</p>

<h2>How to scope the first engagement</h2>
<p>Don't start with the big project. Start with a paid, two-week diagnostic: a small feature, a perf audit, or a migration plan. You learn how they communicate, commit, and ship. They learn your codebase without committing to the whole thing. Either side can walk away cleanly.</p>
<blockquote>The cheapest mistake you can make is hiring a great developer for the wrong project. The most expensive is hiring an okay one for a long one.</blockquote>

<h2>Red flags to walk away from</h2>
<ul>
  <li>Portfolios with only landing pages — Next.js shines in app code, not marketing sites.</li>
  <li>"Full-stack" with no API or database examples.</li>
  <li>Resistance to a paid trial week.</li>
  <li>Day-rate quotes with no scope attached.</li>
  <li>Cannot share a public GitHub or write-only references.</li>
</ul>

<h2>The contract essentials</h2>
<ul>
  <li><strong>IP assignment on payment.</strong> You own the code when you pay for it.</li>
  <li><strong>NDA</strong> if you're sharing roadmap or customer data.</li>
  <li><strong>Kill fee</strong> — 1–2 weeks notice with prorated pay if either side ends early.</li>
  <li><strong>Source of truth.</strong> Repo lives in your org from day one, not theirs.</li>
</ul>

<h2>Where to find them</h2>
<p>The freelance marketplaces (Upwork, Toptal, Arc) are crowded but usable. The better signal is usually a small studio that places senior freelancers and stays accountable for the work. That's the model <a href="/">STINT</a> uses — senior developers, fixed scopes, one point of contact, no recruiter middle layer.</p>

<h2>A short checklist before you sign</h2>
<ul>
  <li>You've seen production code, not just demos.</li>
  <li>The scope, deadline, and payment milestones are written down.</li>
  <li>IP and NDA are in the contract, not "we'll handle it later".</li>
  <li>You agreed on a weekly check-in cadence.</li>
  <li>You ran a paid trial week.</li>
</ul>

<p>Hire slow on the first engagement. Hire fast on the second. That's how you build a freelance bench you can actually rely on.</p>
`.trim(),
  },

  {
    slug: 'freelance-vs-agency-vs-in-house',
    title: 'Freelance vs Agency vs In-House: Which Hiring Model Fits Your Startup',
    description:
      'A blunt comparison of the three ways to staff your product team — cost, speed, accountability, and which to pick at each startup stage.',
    keywords: [
      'freelance vs agency',
      'hire freelance developers',
      'startup hiring',
      'in-house vs freelance',
      'how to hire developers',
    ],
    readingTime: '7 min read',
    publishedAt: new Date('2026-06-08'),
    body: `
<p>Every founder I've talked to in the last year has asked some version of the same question: <em>do I hire a freelancer, an agency, or my first in-house engineer?</em> The honest answer is "it depends" — but the variables that matter are smaller than people think. Here's the framework we use when clients ask.</p>

<h2>The three models in one sentence each</h2>
<ul>
  <li><strong>Freelancer</strong> — one person, hourly or fixed-bid, you manage them.</li>
  <li><strong>Agency / studio</strong> — a team behind one point of contact, fixed-bid, they manage themselves.</li>
  <li><strong>In-house</strong> — a full-time employee on payroll, equity, the works.</li>
</ul>

<h2>What each model is actually good at</h2>

<h3>Freelancers shine when:</h3>
<ul>
  <li>The scope is clear and bounded (a feature, a migration, an audit).</li>
  <li>You need a specialist for a few weeks (Next.js, React Native, infra).</li>
  <li>You can review their work and unblock them async.</li>
  <li>Budget matters more than insurance.</li>
</ul>

<h3>Agencies / studios shine when:</h3>
<ul>
  <li>You need a designer, a backend, and a frontend at the same time.</li>
  <li>You don't have an engineering manager and don't want to be one.</li>
  <li>You want one invoice, one Slack channel, one accountable party.</li>
  <li>The project is bigger than one person can ship in a quarter.</li>
</ul>

<h3>In-house hires shine when:</h3>
<ul>
  <li>The work is open-ended and continuous, not project-shaped.</li>
  <li>Institutional knowledge of your product is becoming a moat.</li>
  <li>You've found product-market fit and need to scale a team around it.</li>
  <li>You can offer enough cash + equity to attract someone real.</li>
</ul>

<h2>Cost, honestly</h2>
<p>Numbers vary, but here's the rough math for a single senior engineer for a 12-week build:</p>
<ul>
  <li><strong>Freelancer</strong> — $25K–$60K. Lowest cash outlay. You eat the project-management cost.</li>
  <li><strong>Agency / studio</strong> — $45K–$120K. Includes PM, design, QA. Higher rate, lower total time-to-ship.</li>
  <li><strong>In-house</strong> — $40K–$80K for 12 weeks of pro-rated comp, plus recruiting fees, equity, and 3+ months of ramp before they ship anything serious. The first hire is rarely the cheapest path; it's the longest-term one.</li>
</ul>

<h2>The hidden cost no one talks about</h2>
<p>Founder attention. A freelancer needs 3–5 hours of your week. An agency needs 1–2. An in-house hire needs 8–12 in the first quarter, then settles. If you're a founder still selling and fundraising, your time is the most expensive resource on the project — model that in.</p>

<blockquote>The right hiring model is whichever one consumes the least of the resource you have least of.</blockquote>

<h2>Stage-by-stage recommendations</h2>

<h3>Pre-product / pre-seed</h3>
<p>One freelancer or a tiny studio. You're still validating. Don't take on payroll until you've validated demand.</p>

<h3>Seed / building MVP</h3>
<p>A studio like <a href="/">STINT</a> or two complementary freelancers. You need to ship a real product fast, not assemble a team. Save in-house hiring for after launch.</p>

<h3>Post-PMF / Series A</h3>
<p>First in-house hire. Probably a tech lead who can hire #2 and #3. Keep one freelancer or studio on retainer for spikes.</p>

<h3>Scaling</h3>
<p>In-house team, freelancers for specialist work the team doesn't do well (design systems, perf, ML).</p>

<h2>The hybrid model most founders end up at</h2>
<p>Almost every successful early-stage team we've worked with ends up with a small core (1–3 in-house) plus a rotating bench of 2–4 trusted freelancers. The in-house team owns the core product. Freelancers ship the bursts: a new mobile app, an integration, a redesign, an enterprise feature.</p>

<h2>Three questions to ask yourself</h2>
<ol>
  <li><strong>Is this work continuous or project-shaped?</strong> Continuous → in-house. Project → freelance or agency.</li>
  <li><strong>How much management capacity do I have?</strong> Low → agency. Medium → freelance. High → in-house.</li>
  <li><strong>What's my time-to-ship pressure?</strong> Fastest → agency. Cheapest → freelance. Most durable → in-house (eventually).</li>
</ol>

<h2>One last thing</h2>
<p>The biggest mistake is treating these as permanent choices. They aren't. You'll cycle through all three as the company grows. The goal isn't to pick the "right" model — it's to pick the one that fits this quarter and revisit it next quarter.</p>

<p>If you want help figuring out which model fits where you are right now, <a href="/contact">tell us about your project</a>. We'll tell you honestly whether you need us, a freelancer, or your first full-time hire.</p>
`.trim(),
  },

  {
    slug: 'mern-stack-in-2026-still-worth-it',
    title: 'MERN Stack in 2026: Still Worth It?',
    description:
      'MongoDB, Express, React, Node — is the MERN stack still a sensible choice for new products in 2026, or has the world moved on? An honest assessment.',
    keywords: [
      'MERN stack',
      'MERN stack 2026',
      'MongoDB Express React Node',
      'is MERN still relevant',
      'MERN stack developers',
    ],
    readingTime: '6 min read',
    publishedAt: new Date('2026-06-15'),
    body: `
<p>MERN — MongoDB, Express, React, Node — has been the default "full JavaScript" stack for the better part of a decade. With Next.js eating React, server components rewriting the rules, and edge databases on every cloud, is MERN still a sensible choice for new products in 2026? Short answer: yes, with caveats. Long answer below.</p>

<h2>What MERN actually means in 2026</h2>
<p>The classic definition (Mongo + Express + React + Node) is honest about the back end and vague about the front end. In 2026 most "MERN" teams are really running:</p>
<ul>
  <li><strong>MongoDB</strong> — usually Atlas, occasionally self-hosted.</li>
  <li><strong>Express</strong> — or Fastify, Hono, or Next.js route handlers.</li>
  <li><strong>React</strong> — almost always inside Next.js App Router these days.</li>
  <li><strong>Node</strong> — sometimes Bun or Deno on greenfield projects.</li>
</ul>
<p>So "MERN" in 2026 is shorthand for "all-JavaScript, document database, React UI" — not a literal package list.</p>

<h2>What MERN is still great for</h2>

<h3>Document-shaped data</h3>
<p>If your data looks like nested documents — products with variants, posts with comments, user profiles with settings — Mongo's flexibility saves you weeks of schema migration. SQL is better when relations matter; Mongo is better when shape evolves.</p>

<h3>One language, top to bottom</h3>
<p>A two-person team can ship a real product end-to-end without context-switching languages. That's not a small win. It's the reason MERN got popular in the first place and it's still true.</p>

<h3>Hiring</h3>
<p>The MERN talent pool is enormous. You can find a senior <a href="/services">MERN stack developer</a> in a week. Try doing that with Rails, Elixir, or Go.</p>

<h3>Vercel / Netlify deploys</h3>
<p>Next.js + Mongo + Atlas + Vercel is a four-click production setup. There's no shorter path from idea to live URL with auth, database, and a deploy pipeline.</p>

<h2>Where MERN starts to hurt</h2>

<h3>Relational data done in Mongo</h3>
<p>If you find yourself writing more <code>$lookup</code> aggregations than queries, you're using the wrong database. Postgres is right there. Don't be a hero.</p>

<h3>Transactions at scale</h3>
<p>Mongo has transactions. They work. They're slower and less ergonomic than Postgres's. If your product is fundamentally transactional (payments, ledgers, inventory), think hard.</p>

<h3>Express in 2026</h3>
<p>Express still works, but it hasn't moved in years. Fastify, Hono, and Next.js route handlers all have better TypeScript stories. If you're greenfielding, you probably don't want to start with Express anymore — even if you keep the "M-N-R" of MERN.</p>

<h3>Server-side React rendering</h3>
<p>Pure SPA React with a separate Express API used to be the canonical MERN setup. In 2026 that's an anti-pattern for most products. Next.js App Router gives you SSR, RSC, route handlers, and edge caching out of the box. The only reason to keep a separate Express server is if you have heavy background work or non-HTTP transports.</p>

<h2>The honest 2026 verdict</h2>
<p>MERN is still a great default for:</p>
<ul>
  <li>MVPs that need to ship in weeks.</li>
  <li>Content-heavy or commerce sites where data shapes evolve.</li>
  <li>Internal tools, dashboards, and CRUD-heavy products.</li>
  <li>Anything where the team is small and JavaScript-fluent.</li>
</ul>

<p>It's a bad default for:</p>
<ul>
  <li>Heavily transactional financial or inventory systems.</li>
  <li>Products where the data is fundamentally relational (graphs, social, analytics).</li>
  <li>Teams that already know Postgres + Prisma well — there's no win in switching.</li>
</ul>

<h2>What we'd actually build in 2026</h2>
<p>For most new STINT projects we ship a slightly evolved MERN:</p>
<ul>
  <li><strong>Next.js App Router</strong> instead of CRA + Express.</li>
  <li><strong>MongoDB Atlas</strong> via Mongoose — still the fastest path to a flexible schema.</li>
  <li><strong>Route handlers</strong> for the API surface; Express only when there's a long-running process.</li>
  <li><strong>TypeScript</strong> end to end — no debate.</li>
  <li><strong>Vercel</strong> for deploys, <strong>Resend</strong> for email, <strong>Clerk or NextAuth</strong> for auth.</li>
</ul>

<p>Call it MERN if you like — the spirit is the same: one language, document data, React UI, ship fast. The pieces have just gotten better.</p>

<blockquote>Stacks don't ship products. People do. Pick the one your team will be productive in on a Tuesday afternoon at 4pm.</blockquote>

<p>If you want a team that already knows this stack cold, <a href="/contact">talk to us</a>. We've been shipping MERN-shaped products since before it was called MERN, and we have opinions about what's actually changed.</p>
`.trim(),
  },
]

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing')
  await mongoose.connect(process.env.MONGODB_URI)
  const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)

  let inserted = 0
  let updated = 0
  for (const post of POSTS) {
    const res = await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      { $set: post },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    if (res.createdAt?.getTime() === res.updatedAt?.getTime()) inserted++
    else updated++
  }
  console.log(`✅ Seed complete. inserted/updated ${POSTS.length} post(s).`)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
