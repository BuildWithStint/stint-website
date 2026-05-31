import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav, Footer } from '../../src/components'
import { getAllPosts } from '../../lib/blog'
import { SafeImage } from '../../src/components/blog/SafeImage'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog — Notes on Software, Freelancing & Engineering',
  description:
    'Practical writing from STINT on freelance developers, hiring, Next.js, React, MERN, and shipping software that lasts.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'STINT Blog',
    description:
      'Practical writing on freelance developers, hiring, Next.js, React, MERN, and shipping software.',
    url: 'https://stint.digital/blog',
    type: 'website',
  },
}

export default async function BlogIndex() {
  const posts = await getAllPosts()

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Nav />

      <header className="relative pt-44 pb-20 px-8 md:px-16">
        <div className="max-w-[1440px] mx-auto">
          <span
            className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-4 block"
            style={{ color: 'var(--accent)' }}
          >
            Field Notes
          </span>
          <h1
            className="font-['Playfair_Display'] font-black leading-[1.05] max-w-4xl"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)' }}
          >
            Writing on software,
            <br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
              freelancing
            </span>{' '}
            & engineering.
          </h1>
          <p
            className="font-['DM_Sans'] text-lg leading-relaxed mt-8 max-w-xl"
            style={{ color: 'rgba(242,237,228,0.55)' }}
          >
            Practical guides from a small studio that ships real software for
            startups and growing teams.
          </p>
        </div>
      </header>

      <section className="px-8 md:px-16 pb-32">
        <div className="max-w-[1440px] mx-auto">
          {posts.length === 0 ? (
            <p
              className="font-['DM_Sans'] text-base"
              style={{ color: 'rgba(242,237,228,0.5)' }}
            >
              No articles yet — check back soon.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group block" data-hover>
                    <div
                      className="relative aspect-[16/10] overflow-hidden mb-6 border"
                      style={{ borderColor: 'rgba(242,237,228,0.08)' }}
                    >
                      <SafeImage
                        src={p.coverImage || '/blog-default.png'}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        fallback={
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              background:
                                'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,151,61,0.15) 0%, transparent 70%), rgba(242,237,228,0.03)',
                            }}
                          >
                            <span
                              className="font-['Playfair_Display'] text-7xl font-black opacity-20"
                              style={{ color: 'var(--accent)' }}
                            >
                              S
                            </span>
                          </div>
                        }
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(10,10,11,0.55) 0%, transparent 50%)',
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span
                        className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: 'rgba(242,237,228,0.5)' }}
                      >
                        {new Date(p.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span
                        className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: 'rgba(242,237,228,0.35)' }}
                      >
                        · {p.readingTime}
                      </span>
                    </div>

                    <h2
                      className="font-['Playfair_Display'] font-black leading-tight transition-colors group-hover:opacity-90"
                      style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)' }}
                    >
                      {p.title}
                      <span style={{ color: 'var(--accent)' }}>.</span>
                    </h2>

                    <p
                      className="font-['DM_Sans'] text-sm leading-relaxed mt-3"
                      style={{ color: 'rgba(242,237,228,0.6)' }}
                    >
                      {p.description}
                    </p>

                    {p.tags?.length ? (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {p.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="font-['DM_Mono'] text-[10px] tracking-[0.2em] uppercase px-2.5 py-1"
                            style={{
                              color: 'var(--accent)',
                              border: '1px solid rgba(200,151,61,0.3)',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
