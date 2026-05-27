import type { Metadata } from 'next'
import { AuthProvider } from '../src/contexts/AuthContext'
import { TeamProvider } from '../src/contexts/TeamContext'
import '../src/index.css'

export const metadata: Metadata = {
  title: 'STINT - New. Hungry. Relentless.',
  description: 'A new creative collective here to prove ourselves.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
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