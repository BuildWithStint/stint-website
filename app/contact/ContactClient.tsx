'use client'

import { Nav, Contact, Footer } from '../../src/components'
import { SEOSchemas } from '../../src/components/SEOSchemas'

export default function ContactClient() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <SEOSchemas />
      <Nav />
      <Contact />
      <Footer />
    </div>
  )
}
