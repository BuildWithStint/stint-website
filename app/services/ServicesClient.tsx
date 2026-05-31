'use client'

import { Nav, Services, WhyUs, Contact, Footer } from '../../src/components'

export default function ServicesClient() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Nav />
      <Services />
      <WhyUs />
      <Contact />
      <Footer />
    </div>
  )
}
