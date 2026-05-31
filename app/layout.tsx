import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '../src/contexts/AuthContext'
import { TeamProvider } from '../src/contexts/TeamContext'
import '../src/index.css'

const SITE_URL = 'https://stint.digital'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'STINT — Web, Mobile & Custom Software Development Studio',
    template: '%s · STINT',
  },
  description:
    'STINT is a digital product and software studio specialising in web development, mobile apps, custom software, backend & APIs, and cloud & DevOps for modern teams.',
  keywords: [
    'web development agency',
    'software development company',
    'custom software development',
    'mobile app development',
    'Next.js development',
    'React development agency',
    'backend and API development',
    'cloud and DevOps services',
    'ERP development',
    'SaaS development',
    'product engineering studio',
    'digital agency',
    'STINT',
    'stint.digital',
    'freelance software developer',
    'freelance developers',
    'hire developers',
    'freelance web developers',
    'Next.js developers',
    'React developers',
    'remote software engineers',
    'MERN stack developers',
    'software consultancy',
    'technology partner',
    'software development services',
    'freelancing platform',
    'software development for startups',
    'software development for enterprises',
    'remote software development',
    'full-stack development',
    'front-end development',
    'back-end development',
    'cloud infrastructure',
    'DevOps consulting',
  ],
  authors: [{ name: 'STINT', url: SITE_URL }],
  creator: 'STINT',
  publisher: 'STINT',
  applicationName: 'STINT',
  category: 'Technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'STINT',
    title: 'STINT — Web, Mobile & Custom Software Development Studio',
    description:
      'A digital product and software studio. We design, build, and scale dependable software for modern teams.',
    locale: 'en_US',
    images: [
      {
        url: '/stint-logo.png',
        width: 1200,
        height: 630,
        alt: 'STINT — Design. Build. Scale.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STINT — Design. Build. Scale.',
    description:
      'A digital product and software studio building dependable software for modern teams.',
    images: ['/stint-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'STINT',
  alternateName: 'STINT Digital',
  url: SITE_URL,
  logo: `${SITE_URL}/stint-logo.png`,
  description:
    'A digital product and software studio specialising in web, mobile, custom software, backend, and cloud development.',
  email: 'buildwithstint@gmail.com',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'buildwithstint@gmail.com',
    contactType: 'customer support',
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://x.com/stintbuild',
    'https://www.instagram.com/stint.7',
    'https://github.com/BuildWithStint',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'STINT',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'STINT',
  url: SITE_URL,
  image: `${SITE_URL}/stint-logo.png`,
  priceRange: '$$',
  areaServed: 'Worldwide',
  serviceType: [
    'Web Development',
    'Mobile App Development',
    'Custom Software Development',
    'Backend & API Development',
    'Cloud & DevOps',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
      </head>
      <body>
        <AuthProvider>
          <TeamProvider>
            {children}
          </TeamProvider>
        </AuthProvider>
      </body>
    </html>
  )
}