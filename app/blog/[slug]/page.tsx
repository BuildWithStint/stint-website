import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Nav, Footer } from '../../../src/components'
import { JsonLd, breadcrumbSchema } from '../../../src/components/seo/JsonLd'
import { Prose } from '../../../src/components/blog/Prose'
import { getPostBySlug, getAllSlugs } from '../../../lib/blog'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post not found' }

  const url = `https://stint.digital/blog/${post.slug}`

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Organization', name: post.author, url: 'https://stint.digital' },
    publisher: {
      '@type': 'Organization',
      name: 'STINT',
      logo: { '@type': 'ImageObject', url: 'https://stint.digital/stint-logo.png' },
    },
    mainEntityOfPage: `https://stint.digital/blog/${post.slug}`,
  }

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <JsonLd data={articleSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: 'https://stint.digital' },
          { name: 'Blog', url: 'https://stint.digital/blog' },
          { name: post.title, url: `https://stint.digital/blog/${post.slug}` },
        ])}
      />
      <Nav />

      <article className="pt-44 pb-24 px-8 md:px-16">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-block font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-10 transition-colors hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            ← All articles
          </Link>

          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((t) => (
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

          <span
            className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase block mb-6"
            style={{ color: 'rgba(242,237,228,0.5)' }}
          >
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            · {post.readingTime} · by {post.author}
          </span>

          <h1
            className="font-['Playfair_Display'] font-black leading-[1.05] mb-8"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            {post.title}
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h1>

          <p
            className="font-['DM_Sans'] text-xl leading-relaxed mb-12"
            style={{ color: 'rgba(242,237,228,0.65)' }}
          >
            {post.description}
          </p>

          {post.coverImage ? (
            <figure className="mb-14 -mx-4 md:mx-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto border"
                style={{ borderColor: 'rgba(242,237,228,0.08)' }}
              />
            </figure>
          ) : (
            <hr style={{ border: 'none', borderTop: '1px solid rgba(242,237,228,0.1)', marginBottom: '2.5rem' }} />
          )}

          <Prose>
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </Prose>

          <div
            className="mt-20 p-10 border"
            style={{
              borderColor: 'rgba(200,151,61,0.3)',
              background: 'rgba(200,151,61,0.04)',
            }}
          >
            <span
              className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-4 block"
              style={{ color: 'var(--accent)' }}
            >
              Hire STINT
            </span>
            <h2
              className="font-['Playfair_Display'] font-black leading-tight mb-4"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
            >
              Need senior freelance developers?
            </h2>
            <p
              className="font-['DM_Sans'] mb-6 max-w-xl"
              style={{ color: 'rgba(242,237,228,0.65)' }}
            >
              We design, build, and scale web, mobile, and custom software for
              startups and growing teams. Tell us about your project.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-7 py-3.5 font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase"
              style={{ background: 'var(--accent)', color: '#0A0A0B' }}
            >
              Start a project →
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
