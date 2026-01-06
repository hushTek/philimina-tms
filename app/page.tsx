import { Hero, Features, HowItWorks, Stats, Testimonials, CTA, Footer } from "./_components/landing-sections";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
