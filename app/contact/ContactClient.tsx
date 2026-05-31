'use client'

import { Nav, Contact, Footer } from '../../src/components'

export default function ContactClient() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Nav />
      <Contact />
      <Footer />
    </div>
  )
}
