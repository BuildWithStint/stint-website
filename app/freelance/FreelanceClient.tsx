'use client'

import {
  Nav,
  Hero,
  Ticker,
  Manifesto,
  Services,
  Work,
  Team,
  WhyUs,
  Contact,
  FeedbackTicker,
  FAQ,
  Footer,
} from '../../src/components'

export default function FreelanceClient() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <Ticker />
      <Manifesto />
      <Services />
      <Work />
      <WhyUs />
      <FeedbackTicker />
      <Team />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}
