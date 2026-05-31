import type { Metadata } from 'next'
import FreelanceClient from './FreelanceClient'
import { JsonLd, breadcrumbSchema } from '../../src/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Hire Freelance Developers — Web, Mobile, Next.js, React & MERN',
  description:
    'Hire senior freelance developers through STINT. Freelance web, mobile, Next.js, React, MERN, backend, and cloud engineers — remote, worldwide, fast delivery.',
  keywords: [
    'freelance',
    'freelance developers',
    'hire freelance developers',
    'freelance web developers',
    'freelance Next.js developers',
    'freelance React developers',
    'freelance MERN developers',
    'freelance software engineers',
    'remote freelance developers',
    'freelance mobile app developers',
    'freelance backend developers',
    'freelance full stack developers',
  ],
  alternates: { canonical: '/freelance' },
  openGraph: {
    title: 'Hire Freelance Developers · STINT',
    description:
      'Senior freelance developers for web, mobile, Next.js, React, MERN, backend, and cloud projects. Remote, worldwide.',
    url: 'https://stint.digital/freelance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hire Freelance Developers · STINT',
    description:
      'Senior freelance developers for web, mobile, Next.js, React, MERN, backend, and cloud projects.',
  },
}

export default function FreelancePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: 'https://stint.digital' },
          { name: 'Freelance Developers', url: 'https://stint.digital/freelance' },
        ])}
      />
      <FreelanceClient />
    </>
  )
}
