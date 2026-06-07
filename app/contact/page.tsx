import type { Metadata } from 'next'
import ContactClient from './ContactClient'
import { JsonLd, breadcrumbSchema } from '../../src/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Contact — Start a Project with STINT',
  description:
    'Tell us about your project. We respond within one business day. Email contact@stint.digital or use the form.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact STINT',
    description: 'Start a project with STINT — we respond within 1 business day.',
    url: 'https://stint.digital/contact',
    type: 'website',
  },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: 'https://stint.digital' },
          { name: 'Contact', url: 'https://stint.digital/contact' },
        ])}
      />
      <ContactClient />
    </>
  )
}
