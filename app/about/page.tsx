import type { Metadata } from 'next'
import AboutClient from './AboutClient'
import { JsonLd, breadcrumbSchema } from '../../src/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'About — A Software Studio Built by Senior Engineers',
  description:
    'STINT is a small, senior software studio. We design, build, and scale dependable web, mobile, and custom software for startups and growing teams.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About STINT',
    description: 'A small, senior software studio.',
    url: 'https://stint.digital/about',
    type: 'website',
  },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: 'https://stint.digital' },
          { name: 'About', url: 'https://stint.digital/about' },
        ])}
      />
      <AboutClient />
    </>
  )
}
