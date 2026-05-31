import type { Metadata } from 'next'
import ServicesClient from './ServicesClient'
import { JsonLd, breadcrumbSchema } from '../../src/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Software Development Services — Web, Mobile, Cloud',
  description:
    'Hire STINT for web development, mobile apps, custom software, backend & APIs, and cloud & DevOps. Senior engineers, fixed scopes, fast delivery worldwide.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Software Development Services · STINT',
    description:
      'Web, mobile, custom software, backend, and cloud engineering by STINT.',
    url: 'https://stint.digital/services',
    type: 'website',
  },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: 'https://stint.digital' },
          { name: 'Services', url: 'https://stint.digital/services' },
        ])}
      />
      <ServicesClient />
    </>
  )
}
