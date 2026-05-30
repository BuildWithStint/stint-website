import type { Metadata } from 'next'
import WorkClient from './WorkClient'

export const metadata: Metadata = {
  title: 'Work — Projects & Case Studies',
  description:
    'Selected work from STINT: web apps, mobile products, custom software, and platforms shipped for modern teams.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Work — STINT',
    description:
      'Selected web, mobile, and custom software projects built by STINT.',
    url: 'https://stint.digital/work',
    type: 'website',
  },
}

export default function Page() {
  return <WorkClient />
}
