'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

const FAQS = [
  {
    q: 'How do I hire freelance developers through STINT?',
    a: 'Send us a short brief via the contact form or email buildwithstint@gmail.com. We respond within one business day, scope the engagement together, and typically start within a week.',
  },
  {
    q: 'What kinds of software does STINT build?',
    a: 'Web apps, mobile apps, custom software, SaaS products, internal tools, ERP systems, backend & APIs, and cloud / DevOps. We work across Next.js, React, React Native, Node.js, and the MERN stack.',
  },
  {
    q: 'Do you work with startups or only larger companies?',
    a: 'Both. We work with early-stage founders shipping MVPs and with growing teams adding engineering capacity. Every engagement gets the same senior attention.',
  },
  {
    q: 'Are you fully remote?',
    a: 'Yes. STINT is a remote-first studio available worldwide. We collaborate over the tools your team already uses — Slack, Linear, GitHub, Figma, Notion.',
  },
  {
    q: 'What does a typical project cost and timeline look like?',
    a: 'Most engagements run between four and twelve weeks. Pricing depends on scope; we share a fixed quote after a short discovery call so you know the cost up front.',
  },
  {
    q: 'Who owns the code and IP?',
    a: 'You do. All source code, designs, and intellectual property transfer to you on delivery. We can sign an NDA before discussing details.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="py-36 relative overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-[1440px] mx-auto px-8 md:px-16">
        <div className="mb-16 max-w-2xl">
          <span
            className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-4 block"
            style={{ color: 'var(--accent)' }}
          >
            FAQ
          </span>
          <h2
            className="font-['Playfair_Display'] font-black leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            Frequently asked questions.
          </h2>
        </div>

        <div className="max-w-3xl">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="border-t last:border-b"
                style={{ borderColor: 'rgba(242,237,228,0.08)' }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-7 text-left group"
                  data-hover
                >
                  <h3
                    className="font-['Playfair_Display'] text-xl md:text-2xl font-bold leading-snug transition-colors"
                    style={{
                      color: isOpen ? 'var(--accent)' : 'var(--foreground)',
                    }}
                  >
                    {item.q}
                  </h3>
                  <span
                    className="shrink-0 transition-transform duration-500"
                    style={{
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      color: 'var(--accent)',
                    }}
                  >
                    <Plus size={22} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p
                        className="font-['DM_Sans'] text-base md:text-lg leading-relaxed pb-8 pr-12 max-w-2xl"
                        style={{ color: 'rgba(242,237,228,0.65)' }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
