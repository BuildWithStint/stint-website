import type { Metadata } from 'next'
import ApiConsoleClient from './ApiConsoleClient'

export const metadata: Metadata = {
  title: 'API Console — Developer Tokens',
  description: 'Generate short-lived, scoped access tokens for local API development.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return <ApiConsoleClient />
}
