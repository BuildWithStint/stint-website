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
} from "../src/components";
import { SEOSchemas } from "../src/components/SEOSchemas";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <SEOSchemas />
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
  );
}