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
  Footer,
} from "../src/components";

export default function HomePage() {
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
      <Contact />
      <Footer />
    </div>
  );
}