'use client'

import { Nav, Manifesto, WhyUs, Team, FeedbackTicker, Footer } from '../../src/components'

export default function AboutClient() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Nav />
      <Manifesto />
      <WhyUs />
      <Team />
      <FeedbackTicker />
      <Footer />
    </div>
  )
}
